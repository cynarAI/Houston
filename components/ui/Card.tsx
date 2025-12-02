import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = "", actions }) => {
  return (
    <div className={`
      relative group
      glass-card rounded-2xl transition-all duration-300
      ${className}
    `}>
      {/* Decorative Glow on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-20 rounded-2xl blur transition duration-500 group-hover:duration-200 pointer-events-none"></div>

      <div className="relative h-full flex flex-col">
        {(title || actions) && (
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5 rounded-t-2xl">
            {title && (
              <h3 className="font-display font-semibold text-white tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-4 bg-neon-blue rounded-full shadow-[0_0_10px_#00f0ff]"></span>
                {title}
              </h3>
            )}
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
        )}
        <div className="p-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};