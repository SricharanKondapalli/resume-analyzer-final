interface ScoreGaugeProps {
  score: number;
  grade: string;
}

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: '#10b981', text: 'text-emerald-400', dropShadow: 'drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]', glow: 'shadow-[inset_0_0_50px_rgba(16,185,129,0.1)]' };
  if (score >= 60) return { stroke: '#fbbf24', text: 'text-amber-400', dropShadow: 'drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]', glow: 'shadow-[inset_0_0_50px_rgba(251,191,36,0.1)]' };
  if (score >= 40) return { stroke: '#f97316', text: 'text-orange-400', dropShadow: 'drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]', glow: 'shadow-[inset_0_0_50px_rgba(249,115,22,0.1)]' };
  return { stroke: '#f43f5e', text: 'text-rose-400', dropShadow: 'drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]', glow: 'shadow-[inset_0_0_50px_rgba(244,63,94,0.1)]' };
}

export default function ScoreGauge({ score, grade }: ScoreGaugeProps) {
  const radius = 75;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const colors = getScoreColor(score);

  return (
    <div className={`flex flex-col items-center justify-center rounded-full w-48 h-48 border border-white/10 bg-slate-900/60 backdrop-blur-xl ${colors.glow} p-6 relative group overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90">
          <circle
            stroke="rgba(255,255,255,0.05)"
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
            className={colors.dropShadow}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-${colors.text} drop-shadow-md`}>{score}</span>
          <span className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">/100</span>
        </div>
      </div>
      <div className="absolute bottom-2 text-center opacity-80 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Class <span className={`font-bold ${colors.text}`}>{grade}</span></p>
      </div>
    </div>
  );
}
