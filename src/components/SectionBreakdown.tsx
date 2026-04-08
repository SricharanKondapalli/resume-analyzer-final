import type { SectionScores } from '../types';

interface SectionBreakdownProps {
  sectionScores: SectionScores;
}

const SECTION_LABELS: Record<keyof SectionScores, string> = {
  contact: 'Contact Info',
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  formatting: 'Formatting',
};

function barColor(score: number) {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-amber-400';
  if (score >= 40) return 'bg-orange-400';
  return 'bg-red-400';
}

export default function SectionBreakdown({ sectionScores }: SectionBreakdownProps) {
  return (
    <div className="space-y-3">
      {(Object.keys(SECTION_LABELS) as (keyof SectionScores)[]).map((key) => {
        const score = sectionScores[key];
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{SECTION_LABELS[key]}</span>
              <span className="text-sm font-semibold text-gray-900">{score}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(score)}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
