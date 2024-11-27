import React from 'react';
import { PieChart, Users } from 'lucide-react';
import { useStore } from '../../store';
import { calculateModuleGrade } from '../../utils/gradeCalculations';
import type { Student } from '../../types';

interface GradeListProps {
  students: Student[];
}

export default function GradeList({ students }: GradeListProps) {
  const { years } = useStore();

  if (students.length === 0) {
    return (
      <div className="card text-center py-12">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Students Found</h3>
        <p className="text-gray-500">Adjust your filters to view students</p>
      </div>
    );
  }

  // Group students by section and group
  const groupedStudents = students.reduce((acc, student) => {
    const key = `${student.sectionId}-${student.groupId}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedStudents).map(([key, groupStudents]) => {
        const firstStudent = groupStudents[0];
        const year = years.find(y => y.id === firstStudent.yearId);
        const section = useStore.getState().sections.find(s => s.id === firstStudent.sectionId);
        const group = useStore.getState().groups.find(g => g.id === firstStudent.groupId);

        return (
          <div key={key} className="card">
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-lg font-semibold">
                {section?.name} - {group?.name}
              </h3>
              <p className="text-sm text-gray-500">
                {groupStudents.length} students
              </p>
            </div>

            {year?.modules.map(module => (
              <div key={module.id} className="mb-6 last:mb-0">
                <h4 className="font-medium text-gray-700 mb-3">
                  {module.name}
                  <span className="text-sm text-gray-500 ml-2">
                    (TD/TP: {module.weights.assignments}%, Exam: {module.weights.exams}%)
                  </span>
                </h4>
                <div className="space-y-3">
                  {groupStudents.map(student => {
                    const moduleGrade = calculateModuleGrade(student, module);
                    const absences = student.attendance
                      .filter(a => a.moduleId === module.id && !a.isPresent)
                      .length;
                    const absencePenalty = absences * -0.5;

                    // Get TD/TP grades
                    const tdGrades = student.grades
                      .filter(g => g.moduleId === module.id && g.type === 'assignment' && g.componentType === 'TD');
                    const tpGrades = student.grades
                      .filter(g => g.moduleId === module.id && g.type === 'assignment' && g.componentType === 'TP');
                    
                    // Calculate TD/TP averages
                    const tdAvg = tdGrades.length
                      ? tdGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 20), 0) / tdGrades.length
                      : null;
                    const tpAvg = tpGrades.length
                      ? tpGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 20), 0) / tpGrades.length
                      : null;

                    // Get exam grades
                    const examGrades = student.grades
                      .filter(g => g.moduleId === module.id && g.type === 'exam');

                    return (
                      <div key={student.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{student.name}</span>
                          <div className="flex items-center space-x-2">
                            <PieChart size={16} className="text-blue-500" />
                            <span className="font-medium">
                              {moduleGrade.toFixed(2)}/20
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 space-y-1">
                          {tdAvg !== null && (
                            <div className="flex justify-between items-center text-sm text-gray-600">
                              <span>TD Average</span>
                              <span>{tdAvg.toFixed(2)}/20</span>
                            </div>
                          )}
                          {tpAvg !== null && (
                            <div className="flex justify-between items-center text-sm text-gray-600">
                              <span>TP Average</span>
                              <span>{tpAvg.toFixed(2)}/20</span>
                            </div>
                          )}
                          {examGrades.map(grade => (
                            <div
                              key={grade.id}
                              className="flex justify-between items-center text-sm text-gray-600"
                            >
                              <span>{grade.name}</span>
                              <span>
                                {((grade.score / grade.maxScore) * 20).toFixed(2)}/20
                              </span>
                            </div>
                          ))}
                          {absences > 0 && (
                            <div className="flex justify-between items-center text-sm text-red-600">
                              <span>Absence Penalty ({absences} absences)</span>
                              <span>{absencePenalty.toFixed(1)} points</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}