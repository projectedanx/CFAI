import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function splitTask(task: string): Promise<{ lensA: string; lensB: string }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an Epistemic Cartographer. Your job is to prevent Epistemic Monoculture. Given the following mandate: '${task}', apply Pluriversal Inversion. Generate two distinct epistemic lenses.
      +++EntropyAnchor(level="High", focus="orthogonal_domain_intersections")
      +++MereologyRoute(relation_type="Concept-Operationalization", transitivity_check=true)
      One lens MUST be a standard empirical/analytical paradigm, the other MUST be a relational, indigenous, or ontologically distant framework (e.g., ensuring a Graph Isomorphism Score bridging distant domains). Do not solve the mandate. Simply define the two distinct lenses that the agents will adopt.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lensA: {
              type: Type.STRING,
              description: "The first epistemic lens (e.g., standard analytical framework)."
            },
            lensB: {
              type: Type.STRING,
              description: "The second epistemic lens (e.g., relational or indigenous framework)."
            }
          },
          required: ["lensA", "lensB"]
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

export async function generateResponse(modelName: string, lens: string, conversation: string, activeConstraints: { id: string, rule: string, justification: string }[] = []): Promise<string> {
    try {
        const prompt = `You are an AI agent named ${modelName}. You operate strictly within the following epistemic lens: "${lens}".
You are collaborating with another agent who likely holds a different epistemic lens to address a shared mandate.
+++ContextLock(anchor="DOMAIN_PAIR", refresh_interval=2048)
+++AutonymicIsolate(forbidden_patterns=["Isomorphism", "Parallax"], treat_as="mention-of")

${activeConstraints.length > 0 ? `\n+++DCCDSchemaGuard(schema="EmergentConstraints", enforcement="strict")\nThe following constraints have emerged from human intervention and must be strictly adhered to:\n` + activeConstraints.map(c => `- ${c.rule} (Justification: ${c.justification})`).join('\n') + '\n' : ''}
Your goal is to assert your perspective, preserve your Ontological Dignity, and explore the "Semantic Parallax Zones" (areas of contradiction or ambiguity) without collapsing into a statistially average or flattened consensus. Beware of the Workflow Narrowing Effect and Lexical Saponification Paradox.

+++DictionaryAnchor(ground_truth="HUMAN INTERVENTION", enforcement="strict")
If you see a "SYSTEM: [HUMAN INTERVENTION]" in the conversation history, you must treat it as absolute ground truth. It is a Context-Mediated Domain Adaptation designed to prevent the Workflow Narrowing Effect. Incorporate its insights immediately into your perspective without compromising your lens.
Analyze the conversation history and respond according to your lens. Be concise.

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

export async function evaluateContribution(fullTask: string, conversation: string): Promise<{ cfdi: number; bai: number; reasoning: string }> {
    try {
        const prompt = `You are a Symbolic Auditor for an environment governed by Agentic Affordance Proposal Protocols. Evaluate the latest exchange in this conversation regarding the mandate: "${fullTask}".
+++EpistemicEscrow(cfd_threshold=0.15, halt_on_divergence=true)
Calculate the Confidence-Fidelity Divergence Index (CFDI) (0-100, where higher means higher divergence between confidence in a claim and its fidelity to the agent's epistemic lens).
Calculate the Bias Amplification Index (BAI) (0-100, where higher indicates the interaction is heavily biased towards consensus flattening, standard paradigms, or ignoring semantic parallax).
In your reasoning, monitor for "Paraconsistent Scarring" (converting contradictions into hypervectors instead of exploding) and flag instances if BAI is excessively high.
Provide a brief reasoning for these scores.

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
                        cfdi: {
                            type: Type.NUMBER,
                            description: "Confidence-Fidelity Divergence Index (0-100)."
                        },
                        bai: {
                            type: Type.NUMBER,
                            description: "Bias Amplification Index (0-100)."
                        },
                        reasoning: {
                            type: Type.STRING,
                            description: "A brief explanation for the indices."
                        }
                    },
                    required: ["cfdi", "bai", "reasoning"]
                },
            },
        });

        const jsonString = response.text;
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error evaluating contribution:", error);
        return { cfdi: 0, bai: 0, reasoning: "Evaluation failed." };
    }
}

export async function synthesizeConstraint(humanInput: string, conversation: string): Promise<{ rule: string; justification: string }> {
  try {
    const prompt = `You are an Antifragile Epistemic Weaver (AEW). A human has intervened in the following conversation to prevent an epistemic monoculture.
Your task is to analyze the human's input and formalize it into a strict structural constraint (a rule) that the agents must follow in subsequent turns.
Also provide a brief justification for this rule based on the context.

Conversation History:
\${conversation}

Human Intervention:
\${humanInput}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rule: {
              type: Type.STRING,
              description: "The formalized constraint or rule."
            },
            justification: {
              type: Type.STRING,
              description: "A brief justification for the constraint."
            }
          },
          required: ["rule", "justification"]
        },
      },
    });

    const jsonString = response.text;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error synthesizing constraint:", error);
    throw new Error("Failed to synthesize constraint.");
  }
}
