import { Router } from 'express';
import { upload } from '../services/FileUploadService';
import { PDFService } from '../services/PDFService';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const pdfService = new PDFService();

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const text = await pdfService.extractText(req.file.path);
    const resumeId = uuidv4();

    // Cleanup the uploaded file after processing
    await pdfService.cleanup(req.file.path);

    return res.json({
      id: resumeId,
      text: text
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
