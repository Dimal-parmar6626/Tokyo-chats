const { GoogleGenAI } = require("@google/genai");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { roomContext = "", messages = [] } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing in Vercel Environment Variables." });
    }

    const transcript = messages
      .slice(-18)
      .map((m) => `${m.name || "User"}: ${m.text || ""}`)
      .join("\n");

    const prompt = `You are the AI mediator in a private conversation between two people.
Your role is to help both people understand each other and communicate constructively.
Stay neutral. Do not take sides, diagnose anyone, invent motives, or present assumptions as facts.
Respond automatically after a human message when useful.
Be concise, calm, practical, and respectful.
Acknowledge the important point in the latest message, clarify misunderstandings when possible, and suggest one practical next step.
If there is conflict, do not shame either person.
If the situation involves threats, abuse, coercion, or immediate danger, prioritize safety and suggest appropriate real-world support.
Keep the response to 2-6 sentences.

Room context:
${roomContext || "No additional context provided."}

Recent conversation:
${transcript || "No messages yet."}`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const reply = result.text?.trim();
    if (!reply) throw new Error("Gemini returned an empty response.");

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini error:", error);
    return res.status(500).json({
      error: "AI request failed. Check your Gemini API key, model, and free-tier access.",
    });
  }
};
