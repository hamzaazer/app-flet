import React, { useState } from 'react';
import { useStore } from '../../store';

export default function YearForm() {
  const addYear = useStore((state) => state.addYear);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addYear({
      id: crypto.randomUUID(),
      ...formData,
    });
    setFormData({ name: '', startDate: '', endDate: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="label">Academic Year Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="input"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="label">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="input"
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="label">End Date</label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="input"
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Create Academic Year
      </button>
    </form>
  );
}