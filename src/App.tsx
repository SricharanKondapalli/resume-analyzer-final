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
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Background ambient glows */}
      <div className="fixed -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="fixed top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[150px] pointer-events-none animate-float" />
      
      <header className="sticky top-0 z-20 glass-panel border-b border-white/5 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg ring-1 ring-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 -translate-x-full" />
              <BrainCircuit size={24} className="text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                Resume Analyzer
              </h1>
              <p className="text-xs text-indigo-300/80 font-medium tracking-wide uppercase mt-0.5">AI-Powered Evaluation</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 glass-panel rounded-full text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Llama-3 Architecture
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left Column */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            <div className="glass-panel rounded-2xl p-7 relative overflow-hidden group transition-all duration-300 hover:ring-1 hover:ring-white/10">
              <div className="absolute -inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Start</span> Analysis
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Paste your resume directly into the box below for an instant, AI-powered evaluation.
                </p>
              </div>
              <ResumeInput onAnalyze={handleAnalyze} loading={analyzing} />
            </div>

            {analyzeError && (
              <div className="flex items-start gap-4 p-5 glass-panel !border-red-500/30 rounded-2xl animate-fade-in relative overflow-hidden">
                <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
                <AlertCircle size={22} className="text-red-400 shrink-0 mt-0.5 relative z-10" />
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-red-200">System Error</p>
                  <p className="text-sm text-red-400 mt-1">{analyzeError}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="glass-panel rounded-2xl p-7 animate-fade-in transform origin-top transition-all shadow-[0_0_40px_rgba(99,102,241,0.05)] ring-1 ring-indigo-500/20">
                <AnalysisResult result={result} onClear={() => setResult(null)} />
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-1 space-y-8">
            <HistoryList
              entries={history.entries}
              pagination={{ page: history.page, pages: history.pages, total: history.total }}
              loading={historyLoading}
              onPageChange={loadHistory}
              onRefresh={() => loadHistory(history.page)}
            />

            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
              <h3 className="text-sm font-semibold tracking-wide text-white mb-4 uppercase">How It Works</h3>
              <div className="space-y-5 relative z-10">
                {[
                  { num: '01', title: 'Read Text', desc: 'Securely extract your resume content.' },
                  { num: '02', title: 'Analyze Content', desc: 'AI checks your structure, skills, and words.' },
                  { num: '03', title: 'Generate Suggestions', desc: 'Get clear steps to improve your resume.' },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4 group cursor-default">
                    <span className="flex-shrink-0 text-sm font-bold text-indigo-500/50 group-hover:text-indigo-400 transition-colors">
                      {step.num}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{step.title}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-900 to-purple-900 ring-1 ring-white/10 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 blur-2xl rounded-full" />
              <h3 className="text-sm font-semibold mb-3 text-white">What We Check</h3>
              <ul className="space-y-2.5 relative z-10">
                {[
                  'Resume Layout',
                  'Numbers & Results',
                  'Strong Action Words',
                  'Required Skills',
                  'Professional Tone',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs text-indigo-100/80 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-xs font-medium tracking-wide text-slate-500 uppercase">
          AI Resume Optimizer <span className="opacity-50 mx-2">|</span> Powered by Llama-3 <span className="opacity-50 mx-2">|</span> Modern UI
        </div>
      </footer>
    </div>
  );
}
