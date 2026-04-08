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
  if (score >= 80) return 'text-green-600 bg-green-100';
  if (score >= 60) return 'text-amber-600 bg-amber-100';
  if (score >= 40) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
}

export default function HistoryList({
  entries,
  pagination,
  loading,
  onPageChange,
  onRefresh,
}: HistoryListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <Clock size={16} className="text-gray-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Analysis History</h3>
            <p className="text-xs text-gray-500">{pagination.total} total records</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Loading history...</span>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700">No analyses yet</p>
          <p className="text-xs text-gray-400 mt-1">Analyze your first resume to see history here</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-50">
            {entries.map((entry) => (
              <li key={entry._id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold ${scoreColor(entry.analysis.score)}`}
                    >
                      {entry.analysis.score}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">Grade: {entry.analysis.grade}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">{entry.wordCount} words</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {entry.analysis.foundKeywords.length} keywords
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {entry.analysis.suggestions.length} suggestions
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.pages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
