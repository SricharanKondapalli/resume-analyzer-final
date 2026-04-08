import { useState, useEffect, useCallback } from 'react';
import { BrainCircuit, AlertCircle } from 'lucide-react';
import ResumeInput from './components/ResumeInput';
import AnalysisResult from './components/AnalysisResult';
import HistoryList from './components/HistoryList';
import { analyzeResume, fetchHistory } from './api/resumeApi';
import type { AnalysisResponse, HistoryEntry } from './types';

interface HistoryState {
  entries: HistoryEntry[];
  page: number;
  pages: number;
  total: number;
}

export default function App() {
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryState>({ entries: [], page: 1, pages: 1, total: 0 });
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = useCallback(async (page = 1) => {
    setHistoryLoading(true);
    try {
      const data = await fetchHistory(page);
      setHistory({
        entries: data.data,
        page: data.pagination.page,
        pages: data.pagination.pages,
        total: data.pagination.total,
      });
    } catch {
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory(1);
  }, [loadHistory]);

  async function handleAnalyze(text: string) {
    setAnalyzing(true);
    setAnalyzeError(null);
    setResult(null);
    try {
      const data = await analyzeResume(text);
      setResult(data);
      loadHistory(1);
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl">
            <BrainCircuit size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Resume Analyzer</h1>
            <p className="text-xs text-gray-500 leading-tight">AI-powered resume scoring & feedback</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              MERN Stack
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900">Paste Your Resume</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Copy and paste your resume content below for an instant AI-powered analysis.
                </p>
              </div>
              <ResumeInput onAnalyze={handleAnalyze} loading={analyzing} />
            </div>

            {analyzeError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Analysis Failed</p>
                  <p className="text-sm text-red-600 mt-0.5">{analyzeError}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <AnalysisResult result={result} onClear={() => setResult(null)} />
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <HistoryList
              entries={history.entries}
              pagination={{ page: history.page, pages: history.pages, total: history.total }}
              loading={historyLoading}
              onPageChange={loadHistory}
              onRefresh={() => loadHistory(history.page)}
            />

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">How It Works</h3>
              <ol className="space-y-3">
                {[
                  { num: '1', title: 'Paste Resume', desc: 'Copy your resume text into the editor above.' },
                  { num: '2', title: 'Click Analyze', desc: 'Our AI engine scans for keywords and structure.' },
                  { num: '3', title: 'Review Results', desc: 'Get a score, grade, and actionable suggestions.' },
                ].map((step) => (
                  <li key={step.num} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {step.num}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{step.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
              <h3 className="text-sm font-semibold mb-2">What We Check</h3>
              <ul className="space-y-1.5">
                {[
                  'Contact information',
                  'Professional summary',
                  'Work experience',
                  'Education & certifications',
                  'Technical keywords',
                  'Action verbs usage',
                  'Resume length & formatting',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-blue-100">
                    <span className="w-1 h-1 rounded-full bg-blue-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-xs text-gray-400">
          Resume Analyzer · MERN Stack · React + Node.js + Express + MongoDB
        </div>
      </footer>
    </div>
  );
}
