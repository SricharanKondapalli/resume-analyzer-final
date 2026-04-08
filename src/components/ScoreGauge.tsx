interface ScoreGaugeProps {
  score: number;
  grade: string;
}

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: '#22c55e', text: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' };
  if (score >= 60) return { stroke: '#f59e0b', text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
  if (score >= 40) return { stroke: '#f97316', text: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' };
  return { stroke: '#ef4444', text: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' };
}

export default function ScoreGauge({ score, grade }: ScoreGaugeProps) {
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const colors = getScoreColor(score);

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border-2 ${colors.border} ${colors.bg} p-6`}>
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90">
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={colors.stroke}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colors.text}`}>{score}</span>
          <span className="text-xs text-gray-500 font-medium">/100</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className={`text-2xl font-bold ${colors.text}`}>{grade}</span>
        <p className="text-sm text-gray-500 mt-0.5">Resume Grade</p>
      </div>
    </div>
  );
}
