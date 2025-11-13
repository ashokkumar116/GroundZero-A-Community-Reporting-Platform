const {GoogleGenAI} = require("@google/genai");
require("dotenv").config();

const generateDescription = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        const prompt = `
                You are an assistant for a civic issue reporting app called GroundZero.
                The user has provided a short title for an issue they are reporting.

                Title: "${title}"

                Write a clear, detailed, and realistic description of the issue suitable for submitting in the app.
                The description should:
                - Explain what the problem is and where it might be happening.
                - Mention possible causes or effects on the community.
                - Sound human, neutral, and factual (no exaggeration).
                - Be 10 to 12 sentences long.

                Return only the description text, no explanations.
                `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
        });

        const description = response.text;
        return res.status(200).json({ description });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = generateDescription;
