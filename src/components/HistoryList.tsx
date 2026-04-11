import { Clock, TrendingUp, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import type { HistoryEntry } from '../types';

interface HistoryListProps {
  entries: HistoryEntry[];
  pagination: { page: number; pages: number; total: number };
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
  if (score >= 60) return 'text-amber-300 bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]';
  if (score >= 40) return 'text-orange-300 bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]';
  return 'text-rose-300 bg-rose-500/10 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
}

export default function HistoryList({
  entries,
  pagination,
  loading,
  onPageChange,
  onRefresh,
}: HistoryListProps) {
  return (
    <div className="glass-panel overflow-hidden rounded-2xl ring-1 ring-white/10 relative">
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-indigo-500 to-purple-500/0 opacity-50" />
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800/50 rounded-xl ring-1 ring-white/5">
            <Clock size={16} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">Analysis Log</h3>
            <p className="text-xs text-slate-500 mt-0.5">{pagination.total} neural scans cached</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 ring-1 ring-white/5 bg-slate-900/50"
          title="Refresh Data"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-indigo-400' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 relative z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Querying Databank...</span>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center relative z-10">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/5 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
            <TrendingUp size={24} className="text-indigo-400/50" />
          </div>
          <p className="text-sm font-semibold text-slate-300">No telemetry recorded</p>
          <p className="text-xs text-slate-500 mt-1">Initiate your first scan to populate this terminal</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-white/5 relative z-10 bg-slate-950/20">
            {entries.map((entry) => (
              <li key={entry._id} className="px-6 py-4 hover:bg-white/5 transition-colors group cursor-default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center justify-center w-11 h-11 rounded-xl text-sm font-bold ${scoreColor(entry.analysis.score)} transition-transform group-hover:scale-110`}
                    >
                      {entry.analysis.score}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-wide">Class {entry.analysis.grade}</span>
                        <span className="text-xs text-slate-600">·</span>
                        <span className="text-xs text-slate-400">{entry.wordCount} tokens</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium uppercase tracking-wider">
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-indigo-300/80">
                      {entry.analysis.foundKeywords.length} tags
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 tracking-wider uppercase">
                      {entry.analysis.suggestions.length} vectors
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-slate-950/40 relative z-10">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Sector {pagination.page} / {pagination.pages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
