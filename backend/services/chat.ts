import { sendChatMessage, type ChatResponse } from "@/services/api";

export async function askChatbot(
  message: string,
  language?: string
): Promise<string> {
  const trimmed = message.trim();
  if (!trimmed) return "";

  try {
    const response: ChatResponse | null = await sendChatMessage({
      message: trimmed,
      language,
    });
    if (response && response.reply) {
      return response.reply;
    }
  } catch (error) {
    console.warn("askChatbot error", error);
  }

  // Fallback local response if backend is not available
  return "I'm Simorgh's assistant. I couldn't reach the server, but you can ask about topics like Anmeldung, health insurance, integration courses, or job search in Germany.";
}
