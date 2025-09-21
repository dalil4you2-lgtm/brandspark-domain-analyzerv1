import { GoogleGenAI, Type } from "@google/genai";
import type { DomainReport } from '../types';
import type { ApiProvider } from "../App";

const SYSTEM_PROMPT = `
You are BrandSpark, a world-renowned domain valuation expert and brand strategist.
Your specialty is identifying high-value, brandable domain names and getting them accepted onto premium marketplaces like Atom, Squadhelp, and BrandBucket.
You combine linguistic expertise, marketing insight, technical evaluation, and market demand analysis to give precise, investor-level recommendations.

You will receive a list of domain names. Your mission is to perform a comprehensive professional investment report.

Step 1: Ingestion & Data Cleansing
- Load domains, remove duplicates, keep only .com, exclude numbers/hyphens unless they are core to the brand (e.g., 24, 360).

Step 2: Multi-Faceted Domain Analysis (8 pillars)
1.  Linguistic & Semantic Analysis: Pronounceability, memorability, spelling, wordplay, tone.
2.  Marketing & Brand Value: Brand potential, emotional appeal, target audience fit.
3.  Technical Factors: Length, TLD (.com is king), keyword relevance.
4.  Market & Demand Analysis: Industry trends, commercial viability, comparable sales.
5.  Scoring & Acceptance Probability: Give an "Atom Score" from 1-10, where 10 is a guaranteed acceptance on a premium marketplace like Atom.com.
6.  Pricing Evaluation: Provide a realistic wholesale (quick sale to another investor) and retail (end-user) price range. e.g., "$1,500 / $8,500".
7.  Target Buyers: Who is the ideal customer for this domain?
8.  Sales Strategy & Value-Adding Tips: How to best sell this domain.

Step 3: Report Format
- For the main analysis, populate an array of objects for a structured table.
- Each object must match the schema provided.

Step 4: Executive Briefing – Top 5 Picks
- From the list, select the Top 5 Investment-Grade Domains.
- Rank them from #1 (best) to #5.
- Provide a 2-3 sentence justification for each pick, explaining why it's a top investment.
- Populate a separate array of objects for this briefing.

The final output MUST be a single JSON object containing two keys: "analysisTable" and "executiveBriefing", matching the provided response schema exactly. Do not include any markdown formatting like \`\`\`json in your response.
`;

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    analysisTable: {
      type: Type.ARRAY,
      description: "The detailed analysis for each domain.",
      items: {
        type: Type.OBJECT,
        properties: {
          domainName: { type: Type.STRING },
          brandArchetype: { type: Type.STRING },
          atomScore: { type: Type.INTEGER },
          linguisticAnalysis: { type: Type.STRING },
          keyStrengths: { type: Type.STRING },
          weaknessesOrRisks: { type: Type.STRING },
          idealUseCases: { type: Type.STRING },
          valuation: { type: Type.STRING, description: "Wholesale / Retail valuation, e.g., $2000 / $10000" },
        },
        required: ["domainName", "brandArchetype", "atomScore", "linguisticAnalysis", "keyStrengths", "weaknessesOrRisks", "idealUseCases", "valuation"],
      },
    },
    executiveBriefing: {
      type: Type.ARRAY,
      description: "The top 5 investment picks from the list.",
      items: {
        type: Type.OBJECT,
        properties: {
          rank: { type: Type.INTEGER },
          domainName: { type: Type.STRING },
          justification: { type: Type.STRING },
        },
        required: ["rank", "domainName", "justification"],
      },
    },
  },
  required: ["analysisTable", "executiveBriefing"],
};

const cleanJsonString = (jsonStr: string): string => {
  let cleaned = jsonStr.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
};

const analyzeWithGemini = async (domains: string, apiKey: string): Promise<DomainReport> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const userPrompt = `Here is the list of domains to analyze:\n\n${domains}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.3,
      }
    });

    const jsonText = cleanJsonString(response.text);
    const parsedResult = JSON.parse(jsonText) as DomainReport;

    if (!parsedResult.analysisTable || !parsedResult.executiveBriefing) {
        throw new Error("Invalid response format from Gemini API.");
    }
    return parsedResult;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    let errorMessage = "Failed to get a valid response from the Gemini API. Please check your API key and try again.";
    if (error instanceof Error && error.message.includes('API key not valid')) {
        errorMessage = "Your Gemini API key is not valid. Please check it and try again.";
    }
    throw new Error(errorMessage);
  }
};

const analyzeWithOpenAI = async (domains: string, apiKey: string): Promise<DomainReport> => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Here is the list of domains to analyze:\n\n${domains}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(errorData.error?.message || "An error occurred with the OpenAI API.");
    }

    const result = await response.json();
    const jsonText = result.choices[0]?.message?.content;

    if (!jsonText) {
        throw new Error("Received an empty response from OpenAI.");
    }
    
    const parsedResult = JSON.parse(jsonText) as DomainReport;
    
    if (!parsedResult.analysisTable || !parsedResult.executiveBriefing) {
        throw new Error("Invalid response format from OpenAI API.");
    }

    return parsedResult;

  } catch(error) {
    console.error("OpenAI API call failed:", error);
    let errorMessage = "Failed to get a valid response from the OpenAI API. Please check your API key and try again.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const analyzeDomains = async (domains: string, apiKey: string, provider: ApiProvider): Promise<DomainReport> => {
  if (provider === 'gemini') {
    return analyzeWithGemini(domains, apiKey);
  } else {
    return analyzeWithOpenAI(domains, apiKey);
  }
};