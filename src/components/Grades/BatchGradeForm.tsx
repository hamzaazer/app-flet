import React, { useState } from 'react';
import { useStore } from '../../store';
import type { Student, ModuleComponent } from '../../types';
import { Save, GraduationCap, BookOpen } from 'lucide-react';

interface BatchGradeFormProps {
  students: Student[];
  onSuccess?: () => void;
}

export default function BatchGradeForm({ students, onSuccess }: BatchGradeFormProps) {
  const { years } = useStore();
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<ModuleComponent['type']>('Course');
  const [scores, setScores] = useState<Record<string, Record<string, string>>>({});

  const yearId = students[0]?.yearId;
  const year = years.find(y => y.id === yearId);
  const selectedModuleData = year?.modules.find(m => m.id === selectedModule);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;

    Object.entries(scores).forEach(([studentId, componentScores]) => {
      Object.entries(componentScores).forEach(([component, score]) => {
        if (!score) return;

        const grade = {
          id: crypto.randomUUID(),
          type: component.startsWith('exam') ? 'exam' : 'assignment',
          moduleId: selectedModule,
          componentType: component.includes('TD') ? 'TD' : component.includes('TP') ? 'TP' : 'Course',
          name: `${component.charAt(0).toUpperCase() + component.slice(1)} Grade`,
          score: Number(score),
          maxScore: 20,
          date: new Date().toISOString(),
        };

        useStore.setState((state) => ({
          students: state.students.map((student) =>
            student.id === studentId
              ? { ...student, grades: [...student.grades, grade] }
              : student
          ),
        }));
      });
    });

    setScores({});
    onSuccess?.();
  };

  const handleScoreChange = (studentId: string, component: string, value: string) => {
    if (value === '' || (Number(value) >= 0 && Number(value) <= 20)) {
      setScores(prev => ({
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {}),
          [component]: value
        }
      }));
    }
  };

  const getExistingGrade = (student: Student, component: string) => {
    return student.grades.find(
      g => g.moduleId === selectedModule && 
      g.componentType === (component.includes('TD') ? 'TD' : component.includes('TP') ? 'TP' : 'Course') &&
      g.type === (component.startsWith('exam') ? 'exam' : 'assignment')
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label">Select Module</label>
        <select
          value={selectedModule}
          onChange={(e) => {
            setSelectedModule(e.target.value);
            setSelectedComponent('Course');
            setScores({});
          }}
          className="input"
          required
        >
          <option value="">Choose a module</option>
          {year?.modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.name}
            </option>
          ))}
        </select>
      </div>

      {selectedModule && selectedModuleData && (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left font-medium text-gray-600">Student</th>
                  {selectedModuleData.components.map((comp) => (
                    <React.Fragment key={comp.type}>
                      {comp.type !== 'Course' && (
                        <th className="p-3 text-left font-medium text-gray-600">
                          {comp.type} ({comp.hours}h)
                        </th>
                      )}
                    </React.Fragment>
                  ))}
                  <th className="p-3 text-left font-medium text-gray-600">Exam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={18} className="text-gray-400" />
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    {selectedModuleData.components.map((comp) => (
                      <React.Fragment key={comp.type}>
                        {comp.type !== 'Course' && (
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={scores[student.id]?.[comp.type.toLowerCase()] || ''}
                                onChange={(e) => handleScoreChange(student.id, comp.type.toLowerCase(), e.target.value)}
                                placeholder={getExistingGrade(student, comp.type)?.score.toString() || 'Grade'}
                                className="input w-24"
                                min="0"
                                max="20"
                                step="0.25"
                              />
                              <span className="text-sm text-gray-500">/20</span>
                            </div>
                          </td>
                        )}
                      </React.Fragment>
                    ))}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={scores[student.id]?.exam || ''}
                          onChange={(e) => handleScoreChange(student.id, 'exam', e.target.value)}
                          placeholder={getExistingGrade(student, 'exam')?.score.toString() || 'Grade'}
                          className="input w-24"
                          min="0"
                          max="20"
                          step="0.25"
                        />
                        <span className="text-sm text-gray-500">/20</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save All Grades
          </button>
        </div>
      )}
    </form>
  );
}