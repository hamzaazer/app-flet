import type { Student } from '../types';
import { calculateFinalGrade, getAttendanceStats } from './gradeCalculations';

export function exportToCSV(students: Student[], store: any) {
  const { years, sections, groups } = store;

  // Prepare CSV headers
  const headers = [
    'Student Name',
    'Age',
    'Academic Year',
    'Section',
    'Group',
    'Final Grade',
    'Attendance Rate',
    'Notes Count',
    'Modules'
  ];

  // Transform data
  const data = students.map(student => {
    const year = years.find(y => y.id === student.yearId);
    const section = sections.find(s => s.id === student.sectionId);
    const group = groups.find(g => g.id === student.groupId);
    
    const attendanceStats = getAttendanceStats(student);
    const finalGrade = calculateFinalGrade(student, year);

    // Get module grades
    const moduleGrades = year?.modules.map(module => {
      const grades = student.grades.filter(g => g.moduleId === module.id);
      if (grades.length === 0) return `${module.name}: N/A`;
      
      const avg = grades.reduce((sum, grade) => 
        sum + (grade.score / grade.maxScore * 20), 0) / grades.length;
      return `${module.name}: ${avg.toFixed(2)}/20`;
    }).join('; ') || 'No modules';

    return [
      `"${student.name}"`, // Wrap in quotes to handle names with commas
      student.age,
      year?.name || 'N/A',
      section?.name || 'N/A',
      group?.name || 'N/A',
      finalGrade.toFixed(2) + '/20',
      attendanceStats.rate.toFixed(2) + '%',
      student.notes.length,
      `"${moduleGrades}"` // Wrap in quotes to handle module list with commas
    ];
  });

  // Combine headers and data
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `student_data_${new Date().toISOString().split('T')[0]}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}