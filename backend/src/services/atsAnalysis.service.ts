import { Groq } from "groq-sdk";
import { ATSScore } from "../types/analysis";

export class ATSAnalysisService {
  private groq: Groq;

  constructor(groqClient: Groq) {
    this.groq = groqClient;
  }

  async analyze(resumeText: string): Promise<ATSScore> {
    const prompt = `You are an ATS (Applicant Tracking System) expert specializing in resume optimization.

IMPORTANT: Return the analysis in the following strict JSON format WITHOUT ANY ADDITIONAL TEXT

Analyze this resume for ATS compatibility:
    ${resumeText}

    IMPORATANT: Return the analysis in the following strict JSON format WITHOUT ANY ADDITIONAL TEXT
    
    Return the analysis in the following strict JSON format without any additional text:
    {
      "overall": number between 0-100,
      "keywords": array of strings containing detected keywords,
      "missing_keywords": array of strings containing important missing keywords,
      "format_score": number between 0-100
    }
    
    Example response format:
    {
      "overall": 85,
      "keywords": ["javascript", "react", "node.js"],
      "missing_keywords": ["docker", "kubernetes"],
      "format_score": 90
    }`;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-specdec", // Good for structured analysis with 32k context
      temperature: 0.3, // Lower temperature for more consistent output
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return {
      overall: result.overall || 0,
      keywords: result.keywords || [],
      missingKeywords: result.missing_keywords || [],
      formatScore: result.format_score || 0,
    };
  }
}
