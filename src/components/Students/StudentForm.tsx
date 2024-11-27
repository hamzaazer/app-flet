import React, { useState } from 'react';
import { useStore } from '../../store';

interface StudentFormProps {
  onSuccess: () => void;
}

export default function StudentForm({ onSuccess }: StudentFormProps) {
  const { years, sections, groups, addStudent } = useStore((state) => ({
    years: state.years,
    sections: state.sections,
    groups: state.groups,
    addStudent: state.addStudent,
  }));

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    yearId: '',
    sectionId: '',
    groupId: '',
  });

  const availableSections = sections.filter(
    (section) => section.yearId === formData.yearId
  );

  const availableGroups = groups.filter(
    (group) => group.sectionId === formData.sectionId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      id: crypto.randomUUID(),
      name: formData.name,
      age: parseInt(formData.age),
      yearId: formData.yearId,
      sectionId: formData.sectionId,
      groupId: formData.groupId,
      attendance: [],
      grades: [],
      notes: [],
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="label">Student Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="age" className="label">Age</label>
        <input
          type="number"
          id="age"
          value={formData.age}
          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
          className="input"
          required
          min="1"
          max="100"
        />
      </div>

      <div>
        <label htmlFor="yearId" className="label">Academic Year</label>
        <select
          id="yearId"
          value={formData.yearId}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            yearId: e.target.value,
            sectionId: '',
            groupId: '',
          }))}
          className="input"
          required
        >
          <option value="">Select Academic Year</option>
          {years.map((year) => (
            <option key={year.id} value={year.id}>{year.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sectionId" className="label">Section</label>
        <select
          id="sectionId"
          value={formData.sectionId}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            sectionId: e.target.value,
            groupId: '',
          }))}
          className="input"
          required
          disabled={!formData.yearId}
        >
          <option value="">Select Section</option>
          {availableSections.map((section) => (
            <option key={section.id} value={section.id}>{section.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="groupId" className="label">Group</label>
        <select
          id="groupId"
          value={formData.groupId}
          onChange={(e) => setFormData(prev => ({ ...prev, groupId: e.target.value }))}
          className="input"
          required
          disabled={!formData.sectionId}
        >
          <option value="">Select Group</option>
          {availableGroups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Add Student
      </button>
    </form>
  );
}