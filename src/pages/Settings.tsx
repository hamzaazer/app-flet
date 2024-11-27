import React, { useState } from 'react';
import { useStore } from '../store';
import { Settings as SettingsIcon, Save, Plus } from 'lucide-react';
import ModuleWeightForm from '../components/Settings/ModuleWeightForm';
import ModuleList from '../components/Settings/ModuleList';

export default function Settings() {
  const { years, addModule } = useStore();
  const [selectedYearId, setSelectedYearId] = useState(years[0]?.id || '');
  const [newModuleName, setNewModuleName] = useState('');
  
  const selectedYear = years.find(y => y.id === selectedYearId);

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedYearId && newModuleName.trim()) {
      addModule(selectedYearId, {
        id: crypto.randomUUID(),
        name: newModuleName.trim(),
        weights: { assignments: 40, exams: 60 },
      });
      setNewModuleName('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon className="text-gray-600" size={24} />
          <h2 className="text-xl font-semibold">Module Management</h2>
        </div>

        <div className="mb-6">
          <label className="label">Academic Year</label>
          <select
            value={selectedYearId}
            onChange={(e) => setSelectedYearId(e.target.value)}
            className="input"
          >
            <option value="">Select Academic Year</option>
            {years.map((year) => (
              <option key={year.id} value={year.id}>{year.name}</option>
            ))}
          </select>
        </div>

        {selectedYearId && (
          <>
            <form onSubmit={handleAddModule} className="flex space-x-2 mb-6">
              <input
                type="text"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                placeholder="Enter module name"
                className="input flex-1"
                required
              />
              <button type="submit" className="btn btn-primary">
                <Plus size={20} />
              </button>
            </form>

            {selectedYear?.modules.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No modules added yet. Add your first module above.
              </p>
            ) : (
              <ModuleList year={selectedYear!} />
            )}
          </>
        )}
      </div>

      {selectedYearId && selectedYear?.modules.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Module Weight Settings</h2>
          <ModuleWeightForm yearId={selectedYearId} />
        </div>
      )}
    </div>
  );
}