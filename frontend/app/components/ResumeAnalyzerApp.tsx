import React, { useState } from 'react';
import ResumeUploader from './ResumeUploader';
import ResumeWorth from './ResumeWorth';
import styles from '../styles/ResumeAnalyzerApp.module.css';
import { useCompletion } from 'ai/react';

type AnalysisResponse = {
  atsScore: {
    overall: number;
    keywords: string[];
    missingKeywords: string[];
    formatScore: number;
  };
  jobMatch: {
    score: number;
    matchingSkills: string[];
    missingSkills: string[];
    recommendations: string[];
    relevance: number;
  };
  structure: {
    completeness: number;
    sectionsPresent: string[];
    sectionsMissing: string[];
    suggestions: string[];
    readability: number;
  };
  detailedFeedback: {
    overallScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    actionItems: string[];
    improvementPlan: string;
  };
};

const ResumeAnalyzerApp = () => {
  const [showWorth, setShowWorth] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const { completion, isLoading, error } = useCompletion({
    api: '/api/resume',
  });

  const handleAnalysis = async () => {
    if (!resumeText || !jobDescription) {
      return;
    }

    setIsLoadingResume(true); // Set loading state here
    
    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysisResult(result);
      setShowWorth(true);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoadingResume(false);
    }
  };

  return (
    <div className={styles.analyzerWrapper}>
      {!showWorth ? (
        <div className={styles.uploaderWrapper}>
          <p className={styles.instructionsText}>Upload your Resume and Job Description</p>
          <ResumeUploader 
            setIsLoading={setIsLoadingResume} 
            setResumeText={setResumeText} 
            setJobDescription={setJobDescription}
            onAnalyze={handleAnalysis}
          />
          {(isLoadingResume || isLoading) && 
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
            </div>}
        </div>
      ) : (
        analysisResult && <ResumeWorth {...analysisResult} />
      )}
      {error && <p className={styles.errorMessage}>{error.message}</p>}
    </div>
  );
};

export default ResumeAnalyzerApp;