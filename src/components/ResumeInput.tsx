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
      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={14}
          className="w-full px-5 py-4 text-sm text-indigo-100 bg-slate-950/40 border border-white/5 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-slate-700 leading-relaxed transition-all shadow-inner backdrop-blur-md"
          disabled={loading}
        />
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 pointer-events-none group-focus-within:ring-indigo-500/30 transition-all" />
        
        {text && (
          <button
            type="button"
            onClick={() => setText('')}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            title="Clear text"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
           <FileText size={14} className="text-indigo-400/70" />
           <span>{wordCount} words loaded</span>
           {wordCount > 0 && wordCount < 50 && (
             <span className="text-amber-400 ml-1 bg-amber-400/10 px-2.5 py-0.5 rounded-full ring-1 ring-amber-400/20">Requires ~50 words minimum</span>
           )}
        </div>

        <button
          type="submit"
          disabled={loading || text.trim().length < 50}
          className="relative overflow-hidden flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-40 disabled:shadow-none transition-all active:scale-95 group focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          {loading ? (
             <>
               <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
               Processing Analysis...
             </>
          ) : (
             <>
               <Sparkles size={16} className="text-indigo-100 group-hover:animate-pulse" />
               Commence Evaluation
             </>
          )}
        </button>
      </div>
    </form>
  );
}
