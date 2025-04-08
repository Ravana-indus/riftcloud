import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from '@/lib/translation';

interface KeyStatProps {
  icon: React.ReactNode;
  value: string | number;
  description: string;
  color?: string;
  delay?: number;
  translateDescription?: boolean;
}

const KeyStat = ({ 
  icon, 
  value, 
  description, 
  color = 'institutional', 
  delay = 0,
  translateDescription = true 
}: KeyStatProps) => {
  const colorClasses = {
    'institutional': 'text-institutional',
    'lime': 'text-lime-600',
    'green': 'text-green-600',
    'blue': 'text-blue-600',
    'purple': 'text-purple-900',
  };
  
  const { t } = useTranslation();

  return (
    <div 
      className="flex flex-col animate-fade-up" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={cn("text-3xl mb-3", colorClasses[color as keyof typeof colorClasses])}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className={cn("text-5xl font-bold mb-2", colorClasses[color as keyof typeof colorClasses])}>
          {value}
        </span>
        <p className="text-gray-600">
          {translateDescription ? t(description) : description}
        </p>
      </div>
    </div>
  );
};

interface KeyStatsGridProps {
  stats: {
    icon: React.ReactNode;
    value: string | number;
    description: string;
    color?: string;
    translateDescription?: boolean;
  }[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const KeyStatsGrid = ({ stats, columns = 2, className }: KeyStatsGridProps) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <div className={cn(
      `grid grid-cols-1 ${gridCols[columns]} gap-x-12 gap-y-16`,
      className
    )}>
      {stats.map((stat, index) => (
        <KeyStat
          key={index}
          icon={stat.icon}
          value={stat.value}
          description={stat.description}
          color={stat.color}
          delay={index * 0.1}
          translateDescription={stat.translateDescription}
        />
      ))}
    </div>
  );
};

export default KeyStatsGrid;
