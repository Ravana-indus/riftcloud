import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleItem {
  title: string;
  description: string;
  points: string[];
  number: number;
}

interface CompactCourseModulesProps {
  modules: ModuleItem[];
}

const CompactCourseModules: React.FC<CompactCourseModulesProps> = ({ modules }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {modules.map((module, index) => (
        <div 
          key={index} 
          className="border border-institutional-100 rounded-lg overflow-hidden shadow-subtle hover:shadow-md transition-all duration-300 animate-fade-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="bg-institutional text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="bg-white text-institutional rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 shadow-sm">
                {module.number}
              </span>
              <h3 className="font-semibold">{module.title}</h3>
            </div>
            <ChevronRight size={20} className="opacity-75" />
          </div>
          <div className="p-5 bg-gradient-to-br from-white to-institutional-50/30">
            <p className="text-gray-700 text-sm mb-4">{module.description}</p>
            <ul className="space-y-2">
              {module.points.map((point, pointIndex) => (
                <li 
                  key={pointIndex} 
                  className={cn(
                    "text-sm flex items-start transition-all group",
                    pointIndex % 2 === 0 ? "hover:bg-institutional-50/50" : "hover:bg-institutional-50/80"
                  )}
                >
                  <span className="bg-institutional-100 text-institutional rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2.5 flex-shrink-0 mt-0.5 group-hover:bg-institutional group-hover:text-white transition-colors">•</span>
                  <span className="py-0.5">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompactCourseModules; 