import React, { useState } from 'react';
import type { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';
import styles from '../styles/ResumeUploader.module.css';
import { MdCloudUpload, MdCheckCircle } from "react-icons/md";

type Props = {
  setResumeText: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
  onAnalyze: () => Promise<void>;
};

type UploadResponse = {
  id: string;
  text: string;
};

const ResumeUploader: React.FC<Props> = ({ setResumeText, setIsLoading, setJobDescription, onAnalyze }) => {
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [localJobDescription, setLocalJobDescription] = useState('');
  const [uploadedResumeData, setUploadedResumeData] = useState<UploadResponse | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const mergeTextContent = (textContent: TextContent) => {
    return textContent.items
      .map((item) => {
        const { str, hasEOL } = item as TextItem;
        return str + (hasEOL ? '\n' : '');
      })
      .join('');
  };

  const uploadResume = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload resume');
    }

    setUploadSuccess(true);
    return response.json();
  };

  const readResume = async (pdfFile: File | undefined) => {
    if (!pdfFile) return;

    try {
      const uploadResponse = await uploadResume(pdfFile);
      setUploadedResumeData(uploadResponse);
      setResumeText(uploadResponse.text);
      console.log(uploadResponse);
      setIsResumeUploaded(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload resume. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setResumeText('');
    setError('');
    setIsLoading(true);

    try {
      const items = event.dataTransfer.items;

      if (!items || items.length !== 1) {
        throw new Error('Please drop a single file.');
      }
      const item = items[0];

      if (item.kind !== 'file' || item.type !== 'application/pdf') {
        throw new Error('Please drop a single PDF file.');
      }
      const file = item.getAsFile();

      if (!file) {
        throw new Error("The PDF wasn't uploaded correctly.");
      }
      await readResume(file);
    } catch (error) {
      setError('There was an error reading the resume. Please try again.');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleButtonUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setIsLoading(true);
    setResumeText('');
    setUploadedResumeData(null);

    try {
      const file = event.target.files?.[0];
      if (!file) {
        setError("The PDF wasn't uploaded correctly.");
        setIsLoading(false);
        return;
      }
      await readResume(file);
    } catch (error) {
      setError('There was an error reading the resume. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent any default behavior
    
    if (!isResumeUploaded) {
      setError('Please upload your resume first');
      return;
    }
    if (!localJobDescription.trim()) {
      setError('Please paste the job description');
      return;
    }
    
    // Set job description first, then call analyze
    setJobDescription(localJobDescription);
    onAnalyze();
    // Remove setIsLoading(true) from here as it's handled in onAnalyze
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.fileUploadBtnContainer} ${isDragOver ? styles.dragOver : ''}`}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e)}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e)}
        onDragEnter={(e: React.DragEvent<HTMLDivElement>) => handleDragEnter(e)}
        onDragLeave={(e: React.DragEvent<HTMLDivElement>) => handleDragLeave(e)}
      >
        <input
          type="file"
          id="file-upload"
          onChange={handleButtonUpload}
          accept="application/pdf"
          hidden
        />
        <label 
          htmlFor="file-upload" 
          className={`${styles.label} ${styles.mainBtn} ${uploadSuccess ? styles.successBtn : ''}`}
        >
          {uploadSuccess ? (
            <>
              <MdCheckCircle /> Resume Uploaded
            </>
          ) : (
            <>
              <MdCloudUpload /> Upload Resume
            </>
          )}
        </label>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      
      <div className={styles.jobDescriptionContainer}>
        <textarea
          className={styles.jobDescriptionInput}
          placeholder="Paste job description here..."
          onChange={(e) => setLocalJobDescription(e.target.value)}
          rows={6}
        />
      </div>

      <button
        className={`${styles.mainBtn} ${styles.submitBtn} ${
          (!isResumeUploaded || !localJobDescription.trim()) ? styles.disabled : ''
        }`}
        onClick={handleSubmit}
        disabled={!isResumeUploaded || !localJobDescription.trim()}
      >
        Analyze Resume
      </button>
      
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default ResumeUploader;