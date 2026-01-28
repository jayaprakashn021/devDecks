import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to determine model based on complexity (simplified for this app to use Flash mostly)
const MODEL_NAME = 'gemini-3-flash-preview'; 

export const generateCodeAssistantResponse = async (prompt: string, context: string = ''): Promise<string> => {
  try {
    const fullPrompt = `
      You are an expert Senior Developer specializing in SAP ABAP, SAP UI5, JavaScript, SQL, and HTML.
      Your goal is to assist a developer by providing concise, correct, and modern code snippets or explanations.
      
      Context: ${context}
      
      User Query: ${prompt}
      
      If providing code, use Markdown code blocks.
      Keep explanations brief and to the point.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: fullPrompt,
    });

    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Error: ${error.message || "Failed to generate response."}`;
  }
};

export const generateSQLHelper = async (schema: string, requirement: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Given the following table schema (or context): ${schema}. Write a SQL query (HANA dialect preferred unless specified) for: ${requirement}. Return only the SQL code in a block.`
        });
        return response.text || "-- No SQL generated";
    } catch (error: any) {
        return `-- Error: ${error.message}`;
    }
}

export const generateUI5View = async (description: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Generate a SAP UI5 XML View for the following requirement: ${description}. Include the necessary namespaces (mvc, m, l, core). Return only the XML code.`
        });
        return response.text || "<!-- No View generated -->";
    } catch (error: any) {
        return `<!-- Error: ${error.message} -->`;
    }
}
