import React from 'react';
import type { Year } from '../../types';
import { BookOpen } from 'lucide-react';

interface ModuleListProps {
  year: Year;
}

export default function ModuleList({ year }: ModuleListProps) {
  return (
    <div className="space-y-3">
      {year.modules.map((module) => (
        <div key={module.id} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen size={20} className="text-gray-500" />
              <h3 className="font-medium">{module.name}</h3>
            </div>
            <div className="text-sm text-gray-500">
              <span>Assignments: {module.weights.assignments}%</span>
              <span className="mx-2">|</span>
              <span>Exams: {module.weights.exams}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}