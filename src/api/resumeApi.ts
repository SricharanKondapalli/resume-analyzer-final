import type { AnalysisResponse, HistoryResponse } from '../types';

const BASE_URL = 'https://resume-analyzer-backend-z42m.onrender.com/api';

export async function analyzeResume(resumeText: string): Promise<AnalysisResponse> {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Failed to analyze resume');
  }
  return res.json();
}

export async function fetchHistory(page = 1, limit = 10): Promise<HistoryResponse> {
  const res = await fetch(`${BASE_URL}/history?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error('Failed to fetch history');
  }
  return res.json();
}
