import React, { useState } from 'react';
import { useStore } from '../../store';

export default function SectionForm() {
  const { years, addSection } = useStore((state) => ({
    years: state.years,
    addSection: state.addSection,
  }));

  const [formData, setFormData] = useState({
    name: '',
    yearId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSection({
      id: crypto.randomUUID(),
      ...formData,
    });
    setFormData({ name: '', yearId: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="yearId" className="label">Academic Year</label>
        <select
          id="yearId"
          value={formData.yearId}
          onChange={(e) => setFormData(prev => ({ ...prev, yearId: e.target.value }))}
          className="input"
          required
        >
          <option value="">Select Academic Year</option>
          {years.map((year) => (
            <option key={year.id} value={year.id}>
              {year.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="name" className="label">Section Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="input"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Create Section
      </button>
    </form>
  );
}