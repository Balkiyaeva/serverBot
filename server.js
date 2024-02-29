const express = require('express');
const app = express();
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");

const PORT = 3001;

app.use(cors());

app.get("/api/faq", async (req, res) => {
    fs.readFile("./company/features.txt", "utf8", async (error, data) => {
        if (error) {
            console.log("Error while reading the file", error);
            return;
        }

        const OPENAI_API_KEY = "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";
        const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
        const aiModel = "gpt-3.5-turbo";
        const text = req.query.question;

        if (text && text.length) {
            const prompt = [];
            prompt.push('You are a company\'s support specialist available to answer any of my question.');
            prompt.push('You must answer only in russian.');
            prompt.push('Politely decline if the question does not match any of the following: ');
            prompt.push(data);

            const messages = [
                {
                    role: "system",
                    content: prompt.join(' '),
                },
                {
                    role: "user",
                    content: text,
                },
            ];

            const completion = await openai.chat.completions.create({
                model: aiModel,
                messages: messages,
            });

            const aiResponse = completion.choices[0].message.content;

            res.json({ aiResponse });
        } else {
            res.json({message: 'No input text provided.'})
        }
    });
});

app.get("/api/text", async (req, res) => {
    const aiResponse = req.query.question

    res.json({aiResponse})
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));