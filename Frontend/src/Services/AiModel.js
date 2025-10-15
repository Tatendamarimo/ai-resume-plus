import Groq from "groq-sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GROQ_API_KEY, GEMENI_API_KEY, OPENAI_API_KEY } from "../config/config";

// Helper function to clean JSON responses
const cleanJSONResponse = (text) => {
  if (!text) return text;
  
  // Remove markdown code blocks
  let cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  
  // Try to extract JSON if it's wrapped in text
  const jsonMatch = cleaned.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  // Remove leading/trailing whitespace and newlines
  cleaned = cleaned.replace(/^[\s\n]+/, "").replace(/[\s\n]+$/, "");
  
  return cleaned;
};

// Initialize Groq
const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMENI_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-pro",
});

const geminiConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

// For chat-based interactions with triple fallback
export const createAIChatSession = () => {
  let conversationHistory = [];
  let geminiChat = geminiModel.startChat({
    generationConfig: geminiConfig,
    history: [],
  });

  return {
    sendMessage: async (userMessage) => {
      // Try Groq first (FREE, fast)
      try {
        conversationHistory.push({
          role: "user",
          content: userMessage
        });

        const response = await groq.chat.completions.create({
          messages: conversationHistory,
          model: "llama-3.3-70b-versatile",
          temperature: 1,
          max_tokens: 8192,
        });

        let assistantMessage = response.choices[0].message.content;

        // Clean up JSON responses - more aggressive cleanup
        assistantMessage = assistantMessage
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .replace(/^[\s\n]+/, "")
          .replace(/[\s\n]+$/, "")
          .trim();

        conversationHistory.push({
          role: "assistant",
          content: assistantMessage
        });

        return {
          text: assistantMessage,
          response: {
            text: () => assistantMessage
          }
        };
      } catch (groqError) {
        console.warn("Groq failed, trying OpenAI:", groqError.message);
        
        // Try OpenAI second (PAID, high quality)
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: conversationHistory.concat([
              { role: "user", content: userMessage }
            ]),
            temperature: 1,
            max_tokens: 8192,
          });

          let assistantMessage = response.choices[0].message.content;

          // Clean up JSON responses - more aggressive cleanup
          assistantMessage = assistantMessage
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .replace(/^[\s\n]+/, "")
            .replace(/[\s\n]+$/, "")
            .trim();

          conversationHistory.push(
            { role: "user", content: userMessage },
            { role: "assistant", content: assistantMessage }
          );

          return {
            text: assistantMessage,
            response: {
              text: () => assistantMessage
            }
          };
        } catch (openaiError) {
          console.warn("OpenAI failed, falling back to Gemini:", openaiError.message);
          
          // Try Gemini last (FREE, good quality)
          try {
            const result = await geminiChat.sendMessage(userMessage);
            let text = result.response.text();

            // Clean up JSON responses - more aggressive cleanup
            text = text
              .replace(/```json/gi, "")
              .replace(/```/g, "")
              .replace(/^[\s\n]+/, "")
              .replace(/[\s\n]+$/, "")
              .trim();

            return {
              text: text,
              response: {
                text: () => text
              }
            };
          } catch (geminiError) {
            console.error("All providers failed:", geminiError);
            throw new Error(`AI Error: All providers failed. Groq: ${groqError.message}, OpenAI: ${openaiError.message}, Gemini: ${geminiError.message}`);
          }
        }
      }
    },

    clearHistory: () => {
      conversationHistory = [];
      geminiChat = geminiModel.startChat({
        generationConfig: geminiConfig,
        history: [],
      });
    }
  };
};

// Create the default chat session with triple fallback
export const AIChatSession = createAIChatSession();

// One-shot generation with triple fallback
export const generateText = async (prompt) => {
  // Try Groq first (FREE, fast)
  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_tokens: 8192,
    });

    let content = response.choices[0].message.content;
    return content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/^[\s\n]+/, "")
      .replace(/[\s\n]+$/, "")
      .trim();
  } catch (groqError) {
    console.warn("Groq failed, trying OpenAI:", groqError.message);
    
    // Try OpenAI second (PAID, high quality)
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 1,
        max_tokens: 8192,
      });

      let content = response.choices[0].message.content;
      return content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .replace(/^[\s\n]+/, "")
        .replace(/[\s\n]+$/, "")
        .trim();
    } catch (openaiError) {
      console.warn("OpenAI failed, falling back to Gemini:", openaiError.message);
      
      // Try Gemini last (FREE, good quality)
      try {
        const result = await geminiModel.generateContent(prompt);
        let text = result.response.text();
        return text
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .replace(/^[\s\n]+/, "")
          .replace(/[\s\n]+$/, "")
          .trim();
      } catch (geminiError) {
        console.error("All providers failed:", geminiError);
        throw new Error(`AI Error: All providers failed. Groq: ${groqError.message}, OpenAI: ${openaiError.message}, Gemini: ${geminiError.message}`);
      }
    }
  }
};

// Manual provider selection (optional)
export const generateWithGroq = async (prompt) => {
  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 1,
    max_tokens: 8192,
  });
  return response.choices[0].message.content;
};

export const generateWithOpenAI = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 1,
    max_tokens: 8192,
  });
  return response.choices[0].message.content;
};

export const generateWithGemini = async (prompt) => {
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
};