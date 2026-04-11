import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import type { AnalysisResponse } from '../types';
import ScoreGauge from './ScoreGauge';
import SectionBreakdown from './SectionBreakdown';

interface AnalysisResultProps {
  result: AnalysisResponse;
  onClear: () => void;
}

const suggestionIcons = {
  warning: <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />,
  info: <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />,
  success: <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />,
};

const suggestionBg = {
  warning: 'bg-amber-900/20 border-amber-500/30 text-amber-200/90 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]',
  info: 'bg-blue-900/20 border-blue-500/30 text-blue-200/90 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]',
  success: 'bg-green-900/20 border-green-500/30 text-green-200/90 shadow-[inset_0_0_20px_rgba(34,197,94,0.05)]',
};

export default function AnalysisResult({ result, onClear }: AnalysisResultProps) {
  const { analysis, wordCount, createdAt } = result;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Analysis Results</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wider">
            {wordCount} WORDS · {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={onClear}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Clear results"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex items-center justify-center p-4">
          <ScoreGauge score={analysis.score} grade={analysis.grade} />
        </div>

        <div className="md:col-span-2 bg-slate-900/40 rounded-2xl border border-white/5 p-6 backdrop-blur-sm shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] pointer-events-none" />
          <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mb-5">
            Section Breakdown
          </h3>
          <SectionBreakdown sectionScores={analysis.sectionScores} />
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-7 backdrop-blur-sm relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-50" />
        <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mb-5">
          AI Diagnostic Output ({analysis.suggestions.length})
        </h3>
        <div className="space-y-4">
          {analysis.suggestions.map((s, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 p-4 rounded-xl border backdrop-blur-md transition-all hover:-translate-y-0.5 ${suggestionBg[s.type]}`}
            >
              {suggestionIcons[s.type]}
              <span className="text-sm font-medium leading-relaxed">{s.message}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 rounded-2xl border border-white/5 p-6 backdrop-blur-sm">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">
            Optimized Keywords
          </h3>
          {analysis.foundKeywords.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No recognized keywords found.</p>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {analysis.foundKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900/40 rounded-2xl border border-white/5 p-6 backdrop-blur-sm">
          <h3 className="text-xs font-bold text-rose-400 uppercase tracking-[0.2em] mb-4">
            Deficient Keywords
          </h3>
          {analysis.missingKeywords.length === 0 ? (
            <p className="text-sm text-slate-500 italic">Optimal keyword coverage achieved!</p>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {analysis.missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
