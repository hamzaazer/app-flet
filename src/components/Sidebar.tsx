import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Calendar,
  ClipboardList,
  BookOpen,
  Settings,
  Home,
  Menu,
  X,
  Award,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface SidebarProps {
  onNavigate: (page: string) => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: <Home size={20} />, onClick: () => handleNavClick('dashboard') },
    { label: 'Students', icon: <Users size={20} />, onClick: () => handleNavClick('students') },
    { label: 'Attendance', icon: <Calendar size={20} />, onClick: () => handleNavClick('attendance') },
    { label: 'Grades', icon: <GraduationCap size={20} />, onClick: () => handleNavClick('grades') },
    { label: 'Results', icon: <Award size={20} />, onClick: () => handleNavClick('results') },
    { label: 'Notes', icon: <ClipboardList size={20} />, onClick: () => handleNavClick('notes') },
    { label: 'Academic', icon: <BookOpen size={20} />, onClick: () => handleNavClick('academic') },
    { label: 'Settings', icon: <Settings size={20} />, onClick: () => handleNavClick('settings') },
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white p-4 transition-transform duration-200 ease-in-out z-40`}
      >
        <div className="flex items-center space-x-2 mb-8 mt-4 lg:mt-0">
          <GraduationCap size={32} className="text-blue-400" />
          <h1 className="text-xl font-bold">EduManager</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}