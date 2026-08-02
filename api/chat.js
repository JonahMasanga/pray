import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { messages } = req.body;

    const prompt = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n\n");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return res.status(200).json({
      reply: text,
    });

  } catch (error) {
    console.error("Gemini error:", error);

    return res.status(500).json({
      error: error.message || "AI service failed",
    });
  }
}