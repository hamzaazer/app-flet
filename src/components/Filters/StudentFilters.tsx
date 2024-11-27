import React from 'react';
import { useStore } from '../../store';
import { Filter, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/exportData';
import type { Student } from '../../types';

interface FilterState {
  yearId: string;
  sectionId: string;
  groupId: string;
  moduleId?: string;
}

interface StudentFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  includeModules?: boolean;
  students: Student[];
}

export default function StudentFilters({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  includeModules = false,
  students,
}: StudentFiltersProps) {
  const store = useStore();
  const { years, sections, groups } = store;

  const availableSections = sections.filter(
    section => !filters.yearId || section.yearId === filters.yearId
  );

  const availableGroups = groups.filter(
    group => !filters.sectionId || group.sectionId === filters.sectionId
  );

  const availableModules = years
    .find(year => year.id === filters.yearId)
    ?.modules || [];

  const handleExport = () => {
    if (students.length === 0) {
      alert('No students to export');
      return;
    }
    exportToCSV(students, store);
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
        >
          <Filter size={20} />
          Filters
        </button>
        <button
          onClick={handleExport}
          className="btn btn-secondary flex items-center gap-2"
          title="Export filtered data"
          disabled={students.length === 0}
        >
          <Download size={20} />
          Export
        </button>
      </div>

      {showFilters && (
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label">Academic Year</label>
              <select
                value={filters.yearId}
                onChange={(e) => setFilters({
                  ...filters,
                  yearId: e.target.value,
                  sectionId: '',
                  groupId: '',
                  moduleId: '',
                })}
                className="input"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year.id} value={year.id}>{year.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Section</label>
              <select
                value={filters.sectionId}
                onChange={(e) => setFilters({
                  ...filters,
                  sectionId: e.target.value,
                  groupId: '',
                })}
                className="input"
                disabled={!filters.yearId}
              >
                <option value="">All Sections</option>
                {availableSections.map((section) => (
                  <option key={section.id} value={section.id}>{section.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Group</label>
              <select
                value={filters.groupId}
                onChange={(e) => setFilters({
                  ...filters,
                  groupId: e.target.value,
                })}
                className="input"
                disabled={!filters.sectionId}
              >
                <option value="">All Groups</option>
                {availableGroups.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>

            {includeModules && (
              <div>
                <label className="label">Module</label>
                <select
                  value={filters.moduleId}
                  onChange={(e) => setFilters({
                    ...filters,
                    moduleId: e.target.value,
                  })}
                  className="input"
                  disabled={!filters.yearId}
                >
                  <option value="">All Modules</option>
                  {availableModules.map((module) => (
                    <option key={module.id} value={module.id}>{module.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({
                yearId: '',
                sectionId: '',
                groupId: '',
                moduleId: '',
              })}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}