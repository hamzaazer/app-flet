import React, { useState } from 'react';
import { useStore } from '../store';
import StudentForm from '../components/Students/StudentForm';
import StudentList from '../components/Students/StudentList';
import StudentFilters from '../components/Filters/StudentFilters';
import { Search } from 'lucide-react';

export default function Students() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    yearId: '',
    sectionId: '',
    groupId: '',
    moduleId: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { students } = useStore();

  const filteredStudents = students.filter(student => {
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
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <StudentFilters
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            includeModules={true}
            students={filteredStudents}
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary whitespace-nowrap"
          >
            {showForm ? 'Cancel' : 'Add New Student'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {showForm && (
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
              <StudentForm onSuccess={() => setShowForm(false)} />
            </div>
          </div>
        )}
        <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <StudentList students={filteredStudents} />
        </div>
      </div>
    </div>
  );
}