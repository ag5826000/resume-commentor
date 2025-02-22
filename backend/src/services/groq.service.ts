import Groq from 'groq-sdk';

export class GroqService {
    private groq: Groq;

    constructor() {
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    }

    async getCompletion(prompt: string): Promise<string> {
        try {
            const completion = await this.groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama3-70b-8192',
            });

            return completion.choices[0]?.message?.content || 'No response generated';
        } catch (error) {
            console.error('Error calling Groq:', error);
            throw error;
        }
    }
}
