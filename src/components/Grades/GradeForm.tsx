import React, { useState } from 'react';
import { useStore } from '../../store';

interface GradeFormProps {
  onSuccess?: () => void;
}

export default function GradeForm({ onSuccess }: GradeFormProps) {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [gradeType, setGradeType] = useState<'assignment' | 'exam'>('assignment');
  const [gradeName, setGradeName] = useState('');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('');

  const { students, years } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedModule) return;

    const grade = {
      id: crypto.randomUUID(),
      type: gradeType,
      moduleId: selectedModule,
      name: gradeName,
      score: Number(score),
      maxScore: Number(maxScore),
      date: new Date().toISOString(),
    };

    useStore.setState((state) => ({
      students: state.students.map((student) =>
        student.id === selectedStudent
          ? { ...student, grades: [...student.grades, grade] }
          : student
      ),
    }));

    setGradeName('');
    setScore('');
    setMaxScore('');
    onSuccess?.();
  };

  const selectedStudentYear = students.find(s => s.id === selectedStudent)?.yearId;
  const availableModules = years.find(y => y.id === selectedStudentYear)?.modules || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Select Student</label>
        <select
          value={selectedStudent}
          onChange={(e) => {
            setSelectedStudent(e.target.value);
            setSelectedModule('');
          }}
          className="input"
          required
        >
          <option value="">Choose a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      {selectedStudent && (
        <div>
          <label className="label">Select Module</label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="input"
            required
          >
            <option value="">Choose a module</option>
            {availableModules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="label">Grade Type</label>
        <select
          value={gradeType}
          onChange={(e) => setGradeType(e.target.value as 'assignment' | 'exam')}
          className="input"
        >
          <option value="assignment">Assignment</option>
          <option value="exam">Exam</option>
        </select>
      </div>

      <div>
        <label className="label">Name</label>
        <input
          type="text"
          value={gradeName}
          onChange={(e) => setGradeName(e.target.value)}
          className="input"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Score</label>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="input"
            required
            min="0"
          />
        </div>
        <div>
          <label className="label">Max Score</label>
          <input
            type="number"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            className="input"
            required
            min="1"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Record Grade
      </button>
    </form>
  );
}