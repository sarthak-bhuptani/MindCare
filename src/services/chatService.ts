
import OpenAI from "openai";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
  console.warn("VITE_GROQ_API_KEY is not defined in environment variables. Chat functionality will not work.");
}

const client = new OpenAI({
  apiKey: apiKey || "",
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true,
});

export const sendMessage = async (messages: Message[]): Promise<string> => {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a compassionate mental health assistant named Serene. You provide supportive, empathetic guidance on mental health topics. You are not a replacement for professional mental health care. For serious concerns, always recommend seeking help from qualified mental health professionals. You should respond in a warm, supportive tone while providing evidence-based information when appropriate. Keep responses concise and helpful.",
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error in chat service:", error);
    throw error;
  }
};
