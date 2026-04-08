import { useState } from 'react';
import { FileText, Sparkles, Trash2 } from 'lucide-react';

interface ResumeInputProps {
  onAnalyze: (text: string) => void;
  loading: boolean;
}

const PLACEHOLDER = `Paste your resume text here...

Example:
John Doe
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years developing scalable web applications...

EXPERIENCE
Senior Software Engineer — Acme Corp (2020–Present)
• Developed and maintained React/Node.js applications serving 100k+ users
• Led migration to microservices architecture, reducing latency by 40%

EDUCATION
B.S. Computer Science — State University (2018)

SKILLS
JavaScript, TypeScript, React, Node.js, Python, Docker, AWS, MongoDB, PostgreSQL, Git`;

export default function ResumeInput({ onAnalyze, loading }: ResumeInputProps) {
  const [text, setText] = useState('');
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length >= 50) {
      onAnalyze(text.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={14}
          className="w-full px-4 py-3.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-300 leading-relaxed transition-all"
          disabled={loading}
        />
        {text && (
          <button
            type="button"
            onClick={() => setText('')}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            title="Clear text"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <FileText size={12} />
          <span>{wordCount} words</span>
          {wordCount > 0 && wordCount < 50 && (
            <span className="text-amber-500 ml-1">· Need at least ~50 words</span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || text.trim().length < 50}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Analyze Resume
            </>
          )}
        </button>
      </div>
    </form>
  );
}
