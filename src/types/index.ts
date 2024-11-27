export interface Student {
  id: string;
  name: string;
  age: number;
  yearId: string;
  sectionId: string;
  groupId: string;
  attendance: AttendanceRecord[];
  grades: Grade[];
  notes: Note[];
}

export interface Year {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  weights: WeightSettings;
  modules: Module[];
}

export interface Module {
  id: string;
  name: string;
  weights: ModuleWeights;
  components: ModuleComponent[];
}

export interface ModuleComponent {
  type: 'TD' | 'TP' | 'Course';
  hours: number;
}

export interface Section {
  id: string;
  name: string;
  yearId: string;
}

export interface Group {
  id: string;
  name: string;
  sectionId: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  moduleId: string;
  componentType: 'TD' | 'TP' | 'Course';
  isPresent: boolean;
  points: number;
}

export interface Grade {
  id: string;
  type: 'assignment' | 'exam';
  moduleId: string;
  componentType: 'TD' | 'TP' | 'Course';
  name: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface WeightSettings {
  attendance: number;
  assignments: number;
  exams: number;
}

export interface ModuleWeights {
  assignments: number;
  exams: number;
}