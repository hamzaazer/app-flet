import React, { useState } from 'react';
import { useStore } from '../../store';

export default function GroupForm() {
  const { sections, addGroup } = useStore((state) => ({
    sections: state.sections,
    addGroup: state.addGroup,
  }));

  const [formData, setFormData] = useState({
    name: '',
    sectionId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGroup({
      id: crypto.randomUUID(),
      ...formData,
    });
    setFormData({ name: '', sectionId: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="sectionId" className="label">Section</label>
        <select
          id="sectionId"
          value={formData.sectionId}
          onChange={(e) => setFormData(prev => ({ ...prev, sectionId: e.target.value }))}
          className="input"
          required
        >
          <option value="">Select Section</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="name" className="label">Group Name</label>
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
        Create Group
      </button>
    </form>
  );
}