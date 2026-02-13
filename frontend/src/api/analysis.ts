import { VideoAnalysisResult } from '../types';

const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export const analyzeVideo = async (file: File): Promise<VideoAnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${baseUrl}/analyze-video`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let message = 'Analysis failed';
    try {
      const error = await response.json();
      message = error?.detail || error?.message || message;
    } catch {
      message = await response.text().catch(() => message);
    }
    throw new Error(message);
  }

  return (await response.json()) as VideoAnalysisResult;
};
