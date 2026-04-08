import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import type { AnalysisResponse } from '../types';
import ScoreGauge from './ScoreGauge';
import SectionBreakdown from './SectionBreakdown';

interface AnalysisResultProps {
  result: AnalysisResponse;
  onClear: () => void;
}

const suggestionIcons = {
  warning: <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />,
  info: <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />,
  success: <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />,
};

const suggestionBg = {
  warning: 'bg-amber-50 border-amber-200',
  info: 'bg-blue-50 border-blue-200',
  success: 'bg-green-50 border-green-200',
};

export default function AnalysisResult({ result, onClear }: AnalysisResultProps) {
  const { analysis, wordCount, createdAt } = result;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {wordCount} words · {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={onClear}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Clear results"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ScoreGauge score={analysis.score} grade={analysis.grade} />
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Section Breakdown
          </h3>
          <SectionBreakdown sectionScores={analysis.sectionScores} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Suggestions ({analysis.suggestions.length})
        </h3>
        <div className="space-y-2.5">
          {analysis.suggestions.map((s, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 p-3 rounded-lg border ${suggestionBg[s.type]}`}
            >
              {suggestionIcons[s.type]}
              <span className="text-sm text-gray-700">{s.message}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Found Keywords
          </h3>
          {analysis.foundKeywords.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No recognized keywords found.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {analysis.foundKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Missing Keywords
          </h3>
          {analysis.missingKeywords.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Great keyword coverage!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"
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
