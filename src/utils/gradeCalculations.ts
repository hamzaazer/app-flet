import type { Student, Year, Module } from '../types';

export function calculateModuleGrade(student: Student, module: Module): number {
  const moduleGrades = student.grades.filter(g => g.moduleId === module.id);
  
  // Calculate assignments grade (TD/TP)
  const tdGrades = moduleGrades.filter(g => g.type === 'assignment' && g.componentType === 'TD');
  const tpGrades = moduleGrades.filter(g => g.type === 'assignment' && g.componentType === 'TP');
  
  // Calculate assignment score (out of 20)
  let assignmentScore = 0;
  if (tdGrades.length && tpGrades.length) {
    // If both TD and TP exist, take average
    const tdAvg = tdGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 20), 0) / tdGrades.length;
    const tpAvg = tpGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 20), 0) / tpGrades.length;
    assignmentScore = (tdAvg + tpAvg) / 2;
  } else if (tdGrades.length) {
    // Only TD grades
    assignmentScore = tdGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 20), 0) / tdGrades.length;
  } else if (tpGrades.length) {
    // Only TP grades
    assignmentScore = tpGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 20), 0) / tpGrades.length;
  }

  // Calculate exam score (out of 20)
  const exams = moduleGrades.filter(g => g.type === 'exam');
  const examScore = exams.length > 0
    ? exams.reduce((acc, g) => acc + (g.score / g.maxScore * 20), 0) / exams.length
    : 0;

  // Calculate attendance points
  const moduleAttendance = student.attendance.filter(a => a.moduleId === module.id);
  const attendancePoints = moduleAttendance.reduce((acc, record) => {
    return acc + (record.isPresent ? 0.5 : 0);
  }, 0);

  // Calculate final grade (out of 20)
  let finalGrade = 0;
  
  // Only include assignment score if there are TD or TP grades
  if (tdGrades.length || tpGrades.length) {
    finalGrade += assignmentScore * (module.weights.assignments / 100);
  }
  
  // Only include exam score if there are exams
  if (exams.length > 0) {
    finalGrade += examScore * (module.weights.exams / 100);
  }
  
  // Add attendance points
  finalGrade += attendancePoints;

  // Ensure grade doesn't go below 0 or above 20
  return Math.max(0, Math.min(20, finalGrade));
}

export function calculateFinalGrade(student: Student, year?: Year): number {
  if (!year) return 0;

  // Calculate grades for each module
  const moduleGrades = year.modules.map(module => calculateModuleGrade(student, module));
  
  // Calculate the average of all module grades
  const totalGrade = moduleGrades.reduce((sum, grade) => sum + grade, 0);
  return moduleGrades.length > 0 ? totalGrade / moduleGrades.length : 0;
}

export function getAttendanceStats(student: Student, moduleId?: string) {
  const relevantAttendance = moduleId 
    ? student.attendance.filter(a => a.moduleId === moduleId)
    : student.attendance;

  const total = relevantAttendance.length;
  const present = relevantAttendance.filter(a => a.isPresent).length;
  const points = relevantAttendance.reduce((acc, record) => acc + (record.isPresent ? 0.5 : 0), 0);

  return {
    total,
    present,
    absent: total - present,
    rate: total > 0 ? (present / total) * 100 : 0,
    points,
  };
}