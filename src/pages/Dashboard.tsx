import React from 'react';
import { Users, BookOpen, GraduationCap, Calendar } from 'lucide-react';
import { useStore } from '../store';
import StatCard from '../components/Dashboard/StatCard';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { students, sections, groups } = useStore();

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      Icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Sections',
      value: sections.length,
      Icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      title: 'Study Groups',
      value: groups.length,
      Icon: GraduationCap,
      color: 'bg-purple-500',
    },
    {
      title: 'Attendance Rate',
      value: 95,
      Icon: Calendar,
      color: 'bg-yellow-500',
    },
  ];

  const handleQuickAction = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {students.length === 0 ? (
              <p className="text-gray-500">No recent activity</p>
            ) : (
              <div className="space-y-2">
                {students.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{student.name}</span>
                    <span className="text-sm text-gray-500">Added to {student.sectionId}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => handleQuickAction('students')} 
              className="btn btn-primary w-full"
            >
              Add New Student
            </button>
            <button 
              onClick={() => handleQuickAction('attendance')} 
              className="btn btn-secondary w-full"
            >
              Take Attendance
            </button>
            <button 
              onClick={() => handleQuickAction('grades')} 
              className="btn btn-secondary w-full"
            >
              Record Grades
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}