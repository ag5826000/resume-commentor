import { Groq } from "groq-sdk";
import { ResumeStructure } from "../types/analysis";

export class ResumeStructureService {
  private groq: Groq;

  constructor(groqClient: Groq) {
    this.groq = groqClient;
  }

  async analyze(resumeText: string): Promise<ResumeStructure> {
    const prompt = `You are an expert resume structure analyzer focused on format and organization.

IMPORTANT: Return the analysis in the following strict JSON format WITHOUT ANY ADDITIONAL TEXT

Analyze the structure and formatting of this resume:
${resumeText}

Return the analysis in the following strict JSON format without any additional text:
    {
      "completeness": number between 0-100 representing how complete the resume is,
      "sections_present": array of strings containing detected resume sections,
      "sections_missing": array of strings containing important missing sections,
      "suggestions": array of strings containing formatting and structure improvements,
      "readability": number between 0-100 representing how readable the resume is
    }

    Example response format:
    {
      "completeness": 85,
      "sections_present": ["summary", "experience", "education", "skills"],
      "sections_missing": ["projects", "certifications"],
      "suggestions": ["Add a projects section", "Make headers more prominent"],
      "readability": 90
    }`;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-specdec", // Excellent for structure analysis with 32k context
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return {
      completeness: result.completeness || 0,
      sectionsPresent: result.sections_present || [],
      sectionsMissing: result.sections_missing || [],
      suggestions: result.suggestions || [],
      readability: result.readability || 0,
    };
  }
}
