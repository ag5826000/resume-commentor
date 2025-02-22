export interface ATSScore {
  overall: number;
  keywords: string[];
  missingKeywords: string[];
  formatScore: number;
}

export interface JobMatch {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  relevance: number;
}

export interface ResumeStructure {
  completeness: number;
  sectionsPresent: string[];
  sectionsMissing: string[];
  suggestions: string[];
  readability: number;
}

export interface AnalysisReport {
  atsScore: ATSScore;
  jobMatch: JobMatch;
  structure: ResumeStructure;
  suggestions: string[];
  detailedFeedback: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    actionItems: string[];
    improvementPlan: string;
  };
}
