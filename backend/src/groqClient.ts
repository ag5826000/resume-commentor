import axios from 'axios';

class GroqClient {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = process.env.GROQ_API_KEY || '';
        this.baseUrl = process.env.GROQ_API_ENDPOINT || '';
    }

    private getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    async analyze(prompt: string, options = {}) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/completions`,
                {
                    model: 'mixtral-8x7b-32768',
                    messages: [{ role: 'user', content: prompt }],
                    ...options
                },
                { headers: this.getHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('GROQ API Error:', error);
            throw error;
        }
    }
}

export const groqClient = new GroqClient();
