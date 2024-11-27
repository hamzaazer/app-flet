import React from 'react';
import { useStore } from '../../store';
import type { Student } from '../../types';
import { GraduationCap, Users, BookOpen } from 'lucide-react';
import { calculateFinalGrade } from '../../utils/gradeCalculations';

interface StudentListProps {
  students: Student[];
}

export default function StudentList({ students }: StudentListProps) {
  const { years, sections, groups } = useStore();

  if (students.length === 0) {
    return (
      <div className="card text-center py-12">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Students Found</h3>
        <p className="text-gray-500">Add your first student to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {students.map((student) => {
        const year = years.find((y) => y.id === student.yearId);
        const section = sections.find((s) => s.id === student.sectionId);
        const group = groups.find((g) => g.id === student.groupId);
        const finalGrade = calculateFinalGrade(student, year);

        return (
          <div key={student.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                <p className="text-gray-500 text-sm">Age: {student.age}</p>
              </div>
              <div className="flex space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <GraduationCap size={16} className="mr-1" />
                  {year?.name}
                </div>
                <div className="flex items-center">
                  <BookOpen size={16} className="mr-1" />
                  {section?.name}
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  {group?.name}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Attendance Rate</p>
                <p className="font-medium">
                  {((student.attendance.filter(a => a.isPresent).length / 
                    Math.max(student.attendance.length, 1)) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-500">Final Grade</p>
                <p className="font-medium">{finalGrade}/20</p>
              </div>
              <div>
                <p className="text-gray-500">Notes</p>
                <p className="font-medium">{student.notes.length}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}