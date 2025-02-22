import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { GroqService } from './services/groq.service';
import uploadRoutes from './routes/uploadRoutes';
import analysisRoutes from './routes/analysisRoutes';

const app = express();
const port = process.env.PORT || 3000;
const groqService = new GroqService();

app.use(cors());
app.use(express.json());
app.use('/api', uploadRoutes);
app.use('/api', analysisRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.post('/api/prompt', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const response = await groqService.getCompletion(prompt);
        res.json({ response });
    } catch (error) {
        console.error('Error processing prompt:', error);
        res.status(500).json({ error: 'Failed to process prompt' });
    }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
