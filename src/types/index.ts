export interface Suggestion {
  type: 'warning' | 'info' | 'success';
  message: string;
}

export interface SectionScores {
  contact: number;
  summary: number;
  experience: number;
  education: number;
  skills: number;
  formatting: number;
}

export interface Analysis {
  score: number;
  grade: string;
  suggestions: Suggestion[];
  missingKeywords: string[];
  foundKeywords: string[];
  sectionScores: SectionScores;
}

export interface AnalysisResponse {
  id: string | null;
  wordCount: number;
  analysis: Analysis;
  createdAt: string;
}

export interface HistoryEntry {
  _id: string;
  wordCount: number;
  analysis: Analysis;
  createdAt: string;
}

export interface HistoryResponse {
  data: HistoryEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
