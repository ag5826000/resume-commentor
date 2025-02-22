import { Router } from 'express';
import { ReportGeneratorService } from '../services/reportGenerator.service';
import { ATSAnalysisService } from '../services/atsAnalysis.service';
import { JobMatchService } from '../services/jobMatch.service';
import { ResumeStructureService } from '../services/resumeStructure.service';
import { Groq } from 'groq-sdk';

const router = Router();
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const reportGenerator = new ReportGeneratorService(
  new ATSAnalysisService(groq),
  new JobMatchService(groq),
  new ResumeStructureService(groq),
  groq
);

router.post('/analyze', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ 
        error: 'Both resumeText and jobDescription are required' 
      });
    }

    const report = await reportGenerator.generateReport(resumeText, jobDescription);
    return res.json(report);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze resume',
      details: (error as Error).message 
    });
  }
});

export default router;
