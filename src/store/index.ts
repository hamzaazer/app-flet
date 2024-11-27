import { create } from 'zustand';
import type { Student, Year, Section, Group, WeightSettings, AttendanceRecord, Module, ModuleWeights } from '../types';

interface Store {
  years: Year[];
  sections: Section[];
  groups: Group[];
  students: Student[];
  addYear: (year: Year) => void;
  addSection: (section: Section) => void;
  addGroup: (group: Group) => void;
  addStudent: (student: Student) => void;
  updateYearWeights: (yearId: string, weights: WeightSettings) => void;
  updateStudentAttendance: (studentId: string, record: AttendanceRecord) => void;
  addModule: (yearId: string, module: Module) => void;
  updateModuleWeights: (yearId: string, moduleId: string, weights: ModuleWeights) => void;
}

const DEFAULT_WEIGHTS: WeightSettings = {
  attendance: 20,
  assignments: 30,
  exams: 50,
};

const DEFAULT_MODULE_WEIGHTS: ModuleWeights = {
  assignments: 40,
  exams: 60,
};

export const useStore = create<Store>((set) => ({
  years: [],
  sections: [],
  groups: [],
  students: [],
  addYear: (year) => set((state) => ({ 
    years: [...state.years, { ...year, weights: DEFAULT_WEIGHTS, modules: [] }] 
  })),
  addSection: (section) => set((state) => ({ sections: [...state.sections, section] })),
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
  addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
  updateYearWeights: (yearId, weights) => set((state) => ({
    years: state.years.map((year) =>
      year.id === yearId ? { ...year, weights } : year
    ),
  })),
  updateStudentAttendance: (studentId, record) =>
    set((state) => ({
      students: state.students.map((student) =>
        student.id === studentId
          ? {
              ...student,
              attendance: [
                ...student.attendance.filter((r) => r.date !== record.date),
                record,
              ],
            }
          : student
      ),
    })),
  addModule: (yearId, module) =>
    set((state) => ({
      years: state.years.map((year) =>
        year.id === yearId
          ? {
              ...year,
              modules: [
                ...year.modules,
                {
                  ...module,
                  weights: DEFAULT_MODULE_WEIGHTS,
                  components: [{ type: 'Course', hours: 2 }],
                },
              ],
            }
          : year
      ),
    })),
  updateModuleWeights: (yearId, moduleId, weights) =>
    set((state) => ({
      years: state.years.map((year) =>
        year.id === yearId
          ? {
              ...year,
              modules: year.modules.map((module) =>
                module.id === moduleId ? { ...module, weights } : module
              ),
            }
          : year
      ),
    })),
}));