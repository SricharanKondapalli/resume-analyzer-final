import type { SectionScores } from '../types';

interface SectionBreakdownProps {
  sectionScores: SectionScores;
}

const SECTION_LABELS: Record<keyof SectionScores, string> = {
  contact: 'Contact Protocol',
  summary: 'Executive Summary',
  experience: 'Operational XP',
  education: 'Academic Base',
  skills: 'Skill Matrices',
  formatting: 'Architecture',
};

function barColor(score: number) {
  if (score >= 80) return 'from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(52,211,153,0.5)]';
  if (score >= 60) return 'from-amber-400 to-amber-600 shadow-[0_0_10px_rgba(251,191,36,0.5)]';
  if (score >= 40) return 'from-orange-400 to-orange-600 shadow-[0_0_10px_rgba(251,146,60,0.5)]';
  return 'from-rose-500 to-rose-700 shadow-[0_0_10px_rgba(244,63,94,0.5)]';
}

function textColor(score: number) {
  if (score >= 80) return 'text-emerald-300';
  if (score >= 60) return 'text-amber-300';
  if (score >= 40) return 'text-orange-300';
  return 'text-rose-300';
}

export default function SectionBreakdown({ sectionScores }: SectionBreakdownProps) {
  return (
    <div className="space-y-4">
      {(Object.keys(SECTION_LABELS) as (keyof SectionScores)[]).map((key) => {
        const score = sectionScores[key];
        return (
          <div key={key} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-300 tracking-wide">{SECTION_LABELS[key]}</span>
              <span className={`text-xs font-bold ${textColor(score)}`}>{score}%</span>
            </div>
            <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden ring-1 ring-white/5 relative">
              <div
                className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out group-hover:brightness-110 ${barColor(score)}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
