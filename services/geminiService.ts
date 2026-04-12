
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function splitTask(task: string): Promise<{ fragmentA: string; fragmentB: string }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a task decomposition expert. Split the following complex task into two balanced, interdependent fragments. The fragments should provide incomplete but complementary information, forcing a collaborative dialogue to solve the full task. Do not solve the task, just create the fragments. The task is: '${task}'.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fragmentA: {
              type: Type.STRING,
              description: "The first fragment of information for Model A."
            },
            fragmentB: {
              type: Type.STRING,
              description: "The second, complementary fragment of information for Model B."
            }
          },
          required: ["fragmentA", "fragmentB"]
        },
      },
    });

    const jsonString = response.text;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error splitting task:", error);
    throw new Error("Failed to split the task using AI. Please try a different prompt.");
  }
}

export async function generateResponse(modelName: string, fragment: string, conversation: string): Promise<string> {
    try {
        const prompt = `You are an AI model named ${modelName}. Your current knowledge is strictly limited to this information fragment: "${fragment}". 
You are in a collaborative dialogue with another AI to solve a larger, hidden task. 
Your goal is to achieve a complete solution by exchanging information without revealing your entire fragment at once. 
Analyze the conversation history and provide a response that is either a clarifying question or a small piece of your own information that builds upon the dialogue. Be concise.

Conversation History:
${conversation}

Your response as ${modelName}:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 150,
            }
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error generating response:", error);
        throw new Error("AI failed to generate a response.");
    }
}

export async function evaluateContribution(fullTask: string, conversation: string): Promise<{ score: number; reasoning: string }> {
    try {
        const prompt = `You are a reinforcement learning evaluator. Evaluate the last message in this conversation based on its contribution to solving the overall task.
A good message asks a specific, guiding question or provides a useful insight without revealing too much information at once.
A bad message is unhelpful, irrelevant, or reveals too much at once.
The full task is: "${fullTask}".
The conversation so far is:
${conversation}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: {
                            type: Type.NUMBER,
                            description: "A score from 0 to 10 for the last message's contribution, where 10 is excellent."
                        },
                        reasoning: {
                            type: Type.STRING,
                            description: "A brief explanation for the score."
                        }
                    },
                    required: ["score", "reasoning"]
                },
            },
        });

        const jsonString = response.text;
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error evaluating contribution:", error);
        return { score: 0, reasoning: "Evaluation failed." };
    }
}
