import { Groq } from "groq-sdk";
import { JobMatch } from "../types/analysis";

export class JobMatchService {
  private groq: Groq;

  constructor(groqClient: Groq) {
    this.groq = groqClient;
  }

  async analyze(resumeText: string, jobDescription: string): Promise<JobMatch> {
    const prompt = `You are an experienced technical recruiter and job matching specialist.

IMPORTANT: Return the analysis in the following strict JSON format WITHOUT ANY ADDITIONAL TEXT

Compare this resume with the job description and analyze the match:

    RESUME:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}

    IMPORATANT: Return the analysis in the following strict JSON format WITHOUT ANY ADDITIONAL TEXT

    Return the analysis in the following strict JSON format without any additional text:
    {
      "score": number between 0-100 representing overall match percentage,
      "matching_skills": array of strings containing skills that match the job requirements,
      "missing_skills": array of strings containing required skills that are missing,
      "recommendations": array of strings containing specific suggestions for improvement,
      "relevance": number between 0-100 representing experience relevance
    }

    Example response format:
    {
      "score": 75,
      "matching_skills": ["javascript", "react", "aws"],
      "missing_skills": ["python", "django"],
      "recommendations": ["Add experience with Python", "Highlight cloud deployment skills"],
      "relevance": 80
    }`;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", // Best for versatile analysis and comparison
      temperature: 0.1,
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return {
      score: result.score || 0,
      matchingSkills: result.matching_skills || [],
      missingSkills: result.missing_skills || [],
      recommendations: result.recommendations || [],
      relevance: result.relevance || 0,
    };
  }
}
