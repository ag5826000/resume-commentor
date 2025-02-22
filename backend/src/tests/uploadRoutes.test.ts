import request from 'supertest';
import express from 'express';
import { PDFService } from '../services/PDFService';
import uploadRoutes from '../routes/uploadRoutes';
import path from 'path';

jest.mock('../services/PDFService');

describe('Upload Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/api', uploadRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully upload and parse PDF', async () => {
    const mockExtractText = jest.spyOn(PDFService.prototype, 'extractText')
      .mockResolvedValue('Extracted text from PDF');

    const mockCleanup = jest.spyOn(PDFService.prototype, 'cleanup')
      .mockResolvedValue();

    const response = await request(app)
      .post('/api/upload')
      .attach('resume', path.join(__dirname, '../tests/fixtures/test.pdf'));

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('text', 'Extracted text from PDF');
    console.log(response.body);
    expect(mockExtractText).toHaveBeenCalled();
    expect(mockCleanup).toHaveBeenCalled();
  });

  it('should return 400 if no file is uploaded', async () => {
    const response = await request(app)
      .post('/api/upload')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'No file uploaded');
  });
});
