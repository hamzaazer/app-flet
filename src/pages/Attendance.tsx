import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import { useStore } from '../store';
import AttendanceForm from '../components/Attendance/AttendanceForm';
import AttendanceHistory from '../components/Attendance/AttendanceHistory';
import StudentFilters from '../components/Filters/StudentFilters';

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    yearId: '',
    sectionId: '',
    groupId: '',
  });

  const { students } = useStore();

  const filteredStudents = students.filter(student => {
    const matchesYear = !filters.yearId || student.yearId === filters.yearId;
    const matchesSection = !filters.sectionId || student.sectionId === filters.sectionId;
    const matchesGroup = !filters.groupId || student.groupId === filters.groupId;

    return matchesYear && matchesSection && matchesGroup;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start gap-4">
        <div className="flex items-center space-x-4 flex-1">
          <Calendar size={20} className="text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input max-w-xs"
          />
        </div>
        <div className="flex items-center gap-4">
          <StudentFilters
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users size={16} />
            <span>{filteredStudents.length} Students</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>
          <AttendanceForm 
            selectedDate={selectedDate} 
            filteredStudents={filteredStudents}
          />
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
          <AttendanceHistory filteredStudents={filteredStudents} />
        </div>
      </div>
    </div>
  );
}