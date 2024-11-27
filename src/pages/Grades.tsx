import React, { useState } from 'react';
import { Search } from 'lucide-react';
import BatchGradeForm from '../components/Grades/BatchGradeForm';
import GradeList from '../components/Grades/GradeList';
import StudentFilters from '../components/Filters/StudentFilters';
import { useStore } from '../store';

export default function Grades() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    yearId: '',
    sectionId: '',
    groupId: '',
    moduleId: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const students = useStore((state) => state.students);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear = !filters.yearId || student.yearId === filters.yearId;
    const matchesSection = !filters.sectionId || student.sectionId === filters.sectionId;
    const matchesGroup = !filters.groupId || student.groupId === filters.groupId;
    const matchesModule = !filters.moduleId || student.grades.some(grade => grade.moduleId === filters.moduleId);

    return matchesSearch && matchesYear && matchesSection && matchesGroup && matchesModule;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <StudentFilters
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            includeModules={true}
          />
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Batch Grade Entry</h2>
          {filteredStudents.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No students match the selected filters
            </p>
          ) : (
            <BatchGradeForm students={filteredStudents} />
          )}
        </div>
      </div>

      <div>
        <GradeList students={filteredStudents} />
      </div>
    </div>
  );
}