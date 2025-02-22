import { ATSAnalysisService } from "./atsAnalysis.service";
import { JobMatchService } from "./jobMatch.service";
import { ResumeStructureService } from "./resumeStructure.service";
import { AnalysisReport } from "../types/analysis";
import { Groq } from "groq-sdk";

export class ReportGeneratorService {
  private groq: Groq;

  constructor(
    private atsService: ATSAnalysisService,
    private jobMatchService: JobMatchService,
    private structureService: ResumeStructureService,
    groqClient: Groq
  ) {
    this.groq = groqClient;
  }

  async generateReport(
    resumeText: string,
    jobDescription: string
  ): Promise<any> {
    const [atsScore, jobMatch, structure] = await Promise.all([
      this.atsService.analyze(resumeText),
      this.jobMatchService.analyze(resumeText, jobDescription),
      this.structureService.analyze(resumeText),
    ]);

    const suggestions = [
      ...atsScore.missingKeywords.map((k) => `Add keyword: ${k}`),
      ...jobMatch.recommendations,
      ...structure.suggestions,
    ];

    const detailedFeedback = await this.generateDetailedFeedback(
      resumeText,
      jobDescription,
      { atsScore, jobMatch, structure, suggestions }
    );

    return {
      atsScore,
      jobMatch,
      structure,
      detailedFeedback
    };
  }

  private async generateDetailedFeedback(
    resumeText: string,
    jobDescription: string,
    analysis: Omit<AnalysisReport, "detailedFeedback">
  ) {
    const prompt = `You are a senior career coach and resume expert with extensive experience in talent acquisition.

    IMPORTANT: Return the analysis in the following strict JSON format WITHOUT ANY ADDITIONAL TEXT

    Analyze this resume and provide detailed feedback:

    RESUME:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}

    ANALYSIS METRICS:
    - ATS Score: ${analysis.atsScore.overall}/100
    - Job Match Score: ${analysis.jobMatch.score}/100
    - Structure Score: ${analysis.structure.completeness}/100

    KEY FINDINGS:
    - Detected Keywords: ${analysis.atsScore.keywords.join(", ")}
    - Missing Keywords: ${analysis.atsScore.missingKeywords.join(", ")}
    - Matching Skills: ${analysis.jobMatch.matchingSkills.join(", ")}
    - Missing Skills: ${analysis.jobMatch.missingSkills.join(", ")}
    - Present Sections: ${analysis.structure.sectionsPresent.join(", ")}
    - Missing Sections: ${analysis.structure.sectionsMissing.join(", ")}

    Return a detailed analysis in the following STRICT JSON format without any other additional text:
    {
      "overall_score": number between 0-100,
      "summary": A concise 2-3 sentence overview of the resume's fitness for the role,
      "strengths": Array of 3-5 key strengths identified in the resume,
      "weaknesses": Array of 3-5 main areas needing improvement,
      "action_items": Array of 4-6 specific, actionable steps to improve the resume,
      "improvement_plan": A structured paragraph describing the recommended approach to enhance the resume
    }
    
    Example:
    {
      "overall_score": 95,
      "summary": "The resume is a strong fit for the role, showcasing exceptional skills and experience.",
      "strengths": ["Expertise in data analysis", "Strong communication skills"],
      "weaknesses": ["Lack of industry-specific knowledge", "Limited project management experience"],
      "action_items": ["Take a course on industry-specific data analysis", "Improve project management skills"],
      "improvement_plan": "To enhance the resume, focus on gaining deeper knowledge in relevant fields and enhancing soft skills such as communication."
    }
    `;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", // Best for detailed analysis and feedback
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return {
      overallScore: result.overall_score || 0,
      summary: result.summary || "Analysis not available",
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
      actionItems: result.action_items || [],
      improvementPlan: result.improvement_plan || "",
    };
  }
}
