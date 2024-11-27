import React, { useState } from 'react';
import { useStore } from '../../store';
import { Check, X, BookOpen } from 'lucide-react';
import type { Student, ModuleComponent } from '../../types';

interface AttendanceFormProps {
  selectedDate: string;
  filteredStudents: Student[];
}

export default function AttendanceForm({ selectedDate, filteredStudents }: AttendanceFormProps) {
  const { updateStudentAttendance, years } = useStore();
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<ModuleComponent['type']>('Course');
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const yearId = filteredStudents[0]?.yearId;
  const year = years.find(y => y.id === yearId);
  const selectedModuleData = year?.modules.find(m => m.id === selectedModule);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;

    Object.entries(attendance).forEach(([studentId, isPresent]) => {
      updateStudentAttendance(studentId, {
        id: crypto.randomUUID(),
        date: selectedDate,
        moduleId: selectedModule,
        componentType: selectedComponent,
        isPresent,
        points: isPresent ? 0.5 : 0,
      });
    });

    // Reset form
    setAttendance({});
  };

  const getExistingAttendance = (student: Student) => {
    return student.attendance.find(
      record => 
        record.date === selectedDate && 
        record.moduleId === selectedModule &&
        record.componentType === selectedComponent
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Select Module</label>
          <select
            value={selectedModule}
            onChange={(e) => {
              setSelectedModule(e.target.value);
              setSelectedComponent('Course');
              setAttendance({});
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

        {selectedModuleData && (
          <div>
            <label className="label">Component</label>
            <select
              value={selectedComponent}
              onChange={(e) => {
                setSelectedComponent(e.target.value as ModuleComponent['type']);
                setAttendance({});
              }}
              className="input"
              required
            >
              {selectedModuleData.components.map((component, index) => (
                <option key={index} value={component.type}>
                  {component.type} ({component.hours}h)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedModule && (
        <div className="space-y-2">
          {filteredStudents.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No students match the selected filters</p>
          ) : (
            filteredStudents.map((student) => {
              const existingRecord = getExistingAttendance(student);
              const isPresent = attendance[student.id] ?? existingRecord?.isPresent ?? true;

              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-gray-400" />
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setAttendance(prev => ({ ...prev, [student.id]: true }))}
                      className={`p-2 rounded-full transition-colors ${
                        isPresent
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance(prev => ({ ...prev, [student.id]: false }))}
                      className={`p-2 rounded-full transition-colors ${
                        !isPresent
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {selectedModule && filteredStudents.length > 0 && (
        <button type="submit" className="btn btn-primary w-full">
          Save Attendance
        </button>
      )}
    </form>
  );
}