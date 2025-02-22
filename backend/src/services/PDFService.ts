import pdf from 'pdf-parse';
import fs from 'fs/promises';

export class PDFService {
  async extractText(filePath: string): Promise<string> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
      } else {
        throw new Error('Failed to extract text from PDF: Unknown error');
      }
    }
  }

  async cleanup(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
    }
  }
}
