interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  icon: React.ReactNode;
  gradient: string;
}

export function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  label,
  icon,
  gradient
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradient})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id={gradient} x1="0%" y1="0%" x2="100%" y2="100%">
              {gradient === "gradient-orange" && (
                <>
                  <stop offset="0%" stopColor="var(--color-gradient-orange)" />
                  <stop offset="100%" stopColor="var(--color-gradient-pink)" />
                </>
              )}
              {gradient === "gradient-blue" && (
                <>
                  <stop offset="0%" stopColor="var(--color-gradient-blue)" />
                  <stop offset="100%" stopColor="var(--color-gradient-purple)" />
                </>
              )}
              {gradient === "gradient-purple" && (
                <>
                  <stop offset="0%" stopColor="var(--color-gradient-purple)" />
                  <stop offset="100%" stopColor="var(--color-gradient-indigo)" />
                </>
              )}
              {gradient === "gradient-pink" && (
                <>
                  <stop offset="0%" stopColor="var(--color-gradient-pink)" />
                  <stop offset="100%" stopColor="var(--color-gradient-purple)" />
                </>
              )}
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-1">{icon}</div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">of {max}</div>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-sm font-medium text-center">{label}</div>
    </div>
  );
}
