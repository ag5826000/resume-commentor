import React, { useState } from 'react';
import styles from '../styles/ResumeWorth.module.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

type Props = {
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

const getScoreColor = (score: number): string => {
  if (score >= 90) return styles.excellent;
  if (score >= 70) return styles.good;
  if (score >= 50) return styles.average;
  return styles.poor;
};

const ResumeWorth: React.FC<Props> = ({ 
  atsScore, 
  jobMatch, 
  structure, 
  detailedFeedback 
}) => {
  const [isScoresExpanded, setIsScoresExpanded] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const overallScore = detailedFeedback.overallScore || Math.round(
    (atsScore.overall + jobMatch.score*3 + structure.completeness) / 5
  );

  const renderScore = (score: number) => (
    <div className={`${styles.scoreValue} ${getScoreColor(score)}`}>
      {score}%
    </div>
  );

  const toggleScores = () => setIsScoresExpanded(!isScoresExpanded);
  const toggleDetails = () => setIsDetailsExpanded(!isDetailsExpanded);

  return (
    <div className={styles.container}>
      <div className={styles.scoreGrid}>
        <Card className={styles.analysisCard}>
          <CardHeader className={styles.cardHeader}>
            <button 
              onClick={toggleScores} 
              className={styles.expandButton}
              aria-label="Toggle details"
            >
              {isScoresExpanded ? <MdExpandLess /> : <MdExpandMore />}
            </button>
            <CardTitle>ATS Score</CardTitle>
            <CardDescription>How well your resume performs with ATS systems</CardDescription>
            {renderScore(atsScore.overall)}
          </CardHeader>
          <CardContent className={`${styles.expandableContent} ${isScoresExpanded ? styles.expanded : ''}`}>
            <div className={styles.keywordSection}>
            {atsScore.missingKeywords.length > 0 && (
                <div className={styles.missingSkills}>
                  <h4>Missing Keywords ({atsScore.missingKeywords.length})</h4>
                  <div className={styles.skillTags}>
                    {atsScore.missingKeywords.map((skill, index) => (
                      <span key={index} className={`${styles.skillTag} ${styles.missingSkill}`}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              <br />
              <h4>Keywords Found ({atsScore.keywords.length})</h4>
              <div className={styles.skillTags}>
                {atsScore.keywords.map((keyword, index) => (
                  <span key={index} className={styles.skillTag}>{keyword}</span>
                ))}
              </div>              
            </div>
          </CardContent>
        </Card>

        <Card className={styles.analysisCard}>
          <CardHeader className={styles.cardHeader}>
            <button 
              onClick={toggleScores} 
              className={styles.expandButton}
              aria-label="Toggle details"
            >
              {isScoresExpanded ? <MdExpandLess /> : <MdExpandMore />}
            </button>
            <CardTitle>Job Match</CardTitle>
            <CardDescription>How well your skills match the job requirements</CardDescription>
            {renderScore(jobMatch.score)}
          </CardHeader>
          <CardContent className={`${styles.expandableContent} ${isScoresExpanded ? styles.expanded : ''}`}>
            <div className={styles.keywordSection}>
              <h4>Matching Skills ({jobMatch.matchingSkills.length})</h4>
              <div className={styles.skillTags}>
                {jobMatch.matchingSkills.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
              <br />
              {jobMatch.missingSkills.length > 0 && (
                <div className={styles.missingSkills}>
                  <h4>Missing Skills ({jobMatch.missingSkills.length})</h4>
                  <div className={styles.skillTags}>
                    {jobMatch.missingSkills.map((skill, index) => (
                      <span key={index} className={`${styles.skillTag} ${styles.missingSkill}`}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={styles.analysisCard}>
          <CardHeader className={styles.cardHeader}>
            <button 
              onClick={toggleScores} 
              className={styles.expandButton}
              aria-label="Toggle details"
            >
              {isScoresExpanded ? <MdExpandLess /> : <MdExpandMore />}
            </button>
            <CardTitle>Resume Structure</CardTitle>
            <CardDescription>How well your resume is organized</CardDescription>
            {renderScore(structure.completeness)}
          </CardHeader>
          <CardContent className={`${styles.expandableContent} ${isScoresExpanded ? styles.expanded : ''}`}>
            <div className={styles.structureDetails}>
              <h4>Present Sections</h4>
              <div className={styles.skillTags}>
                {structure.sectionsPresent.map((section, index) => (
                  <span key={index} className={styles.skillTag}>{section}</span>
                ))}
              </div>
              <br />
              {structure.sectionsMissing.length > 0 && (
                <div className={styles.missingSkills}>
                  <h4>Missing Sections ({structure.sectionsMissing.length})</h4>
                  <div className={styles.skillTags}>
                    {structure.sectionsMissing.map((skill, index) => (
                      <span key={index} className={`${styles.skillTag} ${styles.missingSkill}`}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={styles.detailedFeedbackCard}>
        <CardHeader onClick={toggleDetails} className={styles.cardHeader}>
          <CardTitle className={styles.detailedTitle}>
            Detailed Analysis
            {renderScore(overallScore)}
          </CardTitle>
          <CardDescription className={styles.summaryText}>
            {detailedFeedback.summary}
          </CardDescription>
          <button className={styles.expandButton}>
            {isDetailsExpanded ? <MdExpandLess /> : <MdExpandMore />}
          </button>
        </CardHeader>
        <CardContent className={`${styles.expandableContent} ${isDetailsExpanded ? styles.expanded : ''}`}>
          <div className={styles.feedbackGrid}>
            <div className={styles.feedbackSection}>
              <h4>Strengths</h4>
              <ul className={styles.list}>
                {detailedFeedback.strengths.map((strength, index) => (
                  <li key={index} className={styles.listItem}>{strength}</li>
                ))}
              </ul>
            </div>
            <div className={styles.feedbackSection}>
              <h4>Areas for Improvement</h4>
              <ul className={styles.list}>
                {detailedFeedback.weaknesses.map((weakness, index) => (
                  <li key={index} className={styles.listItem}>{weakness}</li>
                ))}
              </ul>
            </div>
            <div className={styles.feedbackSection}>
              <h4>Action Items</h4>
              <ul className={styles.list}>
                {detailedFeedback.actionItems.map((item, index) => (
                  <li key={index} className={styles.listItem}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeWorth;