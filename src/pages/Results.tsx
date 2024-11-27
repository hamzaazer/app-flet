import React, { useState } from 'react';
import { useStore } from '../store';
import { Search, Award, BookOpen, Users } from 'lucide-react';
import StudentFilters from '../components/Filters/StudentFilters';
import { calculateFinalGrade, calculateModuleGrade, getAttendanceStats } from '../utils/gradeCalculations';

export default function Results() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    yearId: '',
    sectionId: '',
    groupId: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { students, years, sections, groups } = useStore();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear = !filters.yearId || student.yearId === filters.yearId;
    const matchesSection = !filters.sectionId || student.sectionId === filters.sectionId;
    const matchesGroup = !filters.groupId || student.groupId === filters.groupId;

    return matchesSearch && matchesYear && matchesSection && matchesGroup;
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
        <StudentFilters
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div>

      <div className="space-y-6">
        {filteredStudents.map((student) => {
          const year = years.find(y => y.id === student.yearId);
          const section = sections.find(s => s.id === student.sectionId);
          const group = groups.find(g => g.id === student.groupId);
          const finalGrade = calculateFinalGrade(student, year);
          const overallAttendance = getAttendanceStats(student);

          return (
            <div key={student.id} className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">{student.name}</h3>
                  <p className="text-gray-500">
                    {section?.name} - {group?.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {finalGrade.toFixed(2)}/20
                  </div>
                  <p className="text-sm text-gray-500">Final Grade</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="text-yellow-500" size={20} />
                    <h4 className="font-medium">Overall Performance</h4>
                  </div>
                  <p className="text-3xl font-bold">
                    {finalGrade >= 10 ? 'Pass' : 'Fail'}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-blue-500" size={20} />
                    <h4 className="font-medium">Attendance</h4>
                  </div>
                  <p className="text-3xl font-bold">
                    {overallAttendance.rate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    +{overallAttendance.points} points
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="text-green-500" size={20} />
                    <h4 className="font-medium">Modules</h4>
                  </div>
                  <p className="text-3xl font-bold">
                    {year?.modules.length || 0}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Module Details</h4>
                {year?.modules.map(module => {
                  const moduleGrade = calculateModuleGrade(student, module);
                  const moduleAttendance = getAttendanceStats(student, module.id);

                  return (
                    <div key={module.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium">{module.name}</h5>
                          <p className="text-sm text-gray-500">
                            Assignments: {module.weights.assignments}% | 
                            Exams: {module.weights.exams}%
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {moduleGrade.toFixed(2)}/20
                          </div>
                          <p className="text-sm text-gray-500">
                            Attendance: {moduleAttendance.rate.toFixed(1)}% 
                            (+{moduleAttendance.points} pts)
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}