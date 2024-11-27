import React from 'react';
import { Calendar, Check, X, BookOpen } from 'lucide-react';
import type { Student } from '../../types';
import { useStore } from '../../store';

interface AttendanceHistoryProps {
  filteredStudents: Student[];
}

export default function AttendanceHistory({ filteredStudents }: AttendanceHistoryProps) {
  const { years } = useStore();

  const attendanceByDateAndModule = filteredStudents.reduce((acc, student) => {
    student.attendance.forEach((record) => {
      const key = `${record.date}-${record.moduleId}-${record.componentType}`;
      if (!acc[key]) {
        acc[key] = {
          date: record.date,
          moduleId: record.moduleId,
          componentType: record.componentType,
          present: 0,
          absent: 0,
          total: 0,
        };
      }
      acc[key][record.isPresent ? 'present' : 'absent']++;
      acc[key].total++;
    });
    return acc;
  }, {} as Record<string, { 
    date: string;
    moduleId: string;
    componentType: string;
    present: number;
    absent: number;
    total: number;
  }>);

  const sortedRecords = Object.values(attendanceByDateAndModule).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getModuleName = (moduleId: string) => {
    for (const year of years) {
      const module = year.modules.find(m => m.id === moduleId);
      if (module) return module.name;
    }
    return 'Unknown Module';
  };

  return (
    <div className="space-y-3">
      {sortedRecords.length === 0 ? (
        <div className="text-center py-8">
          <Calendar size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No attendance records yet</p>
        </div>
      ) : (
        sortedRecords.map((record) => {
          const attendanceRate = (record.present / record.total) * 100;
          const moduleName = getModuleName(record.moduleId);

          return (
            <div key={`${record.date}-${record.moduleId}-${record.componentType}`} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-gray-400" />
                  <span className="font-medium">{moduleName}</span>
                  <span className="text-sm text-gray-500">({record.componentType})</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(record.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center text-green-600">
                  <Check size={16} className="mr-1" />
                  {record.present} present
                </div>
                <div className="flex items-center text-red-600">
                  <X size={16} className="mr-1" />
                  {record.absent} absent
                </div>
                <div className="flex-1 text-right">
                  <span className="font-medium">{attendanceRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}