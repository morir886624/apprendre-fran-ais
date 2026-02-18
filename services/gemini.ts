
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizQuestion, TranslationEntry } from "../types";

// Always use named parameter for apiKey and use process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const translateText = async (text: string, from: string, to: string) => {
  if (!text.trim()) return { translation: '', definition: '' };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following text from ${from} to ${to}. Provide the direct translation and a short definition/context in the target language.
      Format the output as JSON with keys "translation" and "definition".
      Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translation: { type: Type.STRING },
            definition: { type: Type.STRING },
          },
          required: ["translation", "definition"]
        }
      }
    });

    // Directly access text property from response as per guidelines.
    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Translation error:", error);
    return { translation: "Error", definition: "Could not translate." };
  }
};

export const generateSpeech = async (text: string) => {
  if (!text.trim()) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak this clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS generation error:", error);
    return null;
  }
};

// Properly type the function to return a Promise of QuizQuestion array and ensure literal types for 'type' field to fix assignment errors.
export const generateQuizQuestions = async (entries: TranslationEntry[]): Promise<QuizQuestion[]> => {
  if (entries.length < 2) return [];

  return entries.map((entry, index) => {
    const isReverse = Math.random() > 0.5;
    const distractors = entries
      .filter((_, i) => i !== index)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(e => isReverse ? e.sourceText : e.translatedText);

    const word = isReverse ? entry.translatedText : entry.sourceText;
    const correctAnswer = isReverse ? entry.sourceText : entry.translatedText;

    // Explicitly typed object literal to satisfy the QuizQuestion interface and its union 'type' field.
    const question: QuizQuestion = {
      id: entry.id,
      word,
      correctAnswer,
      options: [...distractors, correctAnswer].sort(() => 0.5 - Math.random()),
      type: isReverse ? 'reverse-translation' : 'translation'
    };
    return question;
  });
};
