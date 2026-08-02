import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { messages } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    return res.status(200).json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("OpenAI error:", error);

    return res.status(500).json({
      error: error.message || "AI service failed",
    });
  }
}
