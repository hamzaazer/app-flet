import React, { useState } from 'react';
import { useStore } from '../../store';
import { Save, Plus, Minus } from 'lucide-react';
import type { ModuleComponent } from '../../types';

interface ModuleWeightFormProps {
  yearId: string;
}

export default function ModuleWeightForm({ yearId }: ModuleWeightFormProps) {
  const { years, updateModuleWeights } = useStore();
  const [selectedModuleId, setSelectedModuleId] = useState('');
  
  const selectedYear = years.find(y => y.id === yearId);
  const selectedModule = selectedYear?.modules.find(m => m.id === selectedModuleId);

  const [weights, setWeights] = useState({
    assignments: selectedModule?.weights.assignments || 40,
    exams: selectedModule?.weights.exams || 60,
  });

  const [components, setComponents] = useState<ModuleComponent[]>(
    selectedModule?.components || [{ type: 'Course', hours: 2 }]
  );

  const handleModuleChange = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    const module = selectedYear?.modules.find(m => m.id === moduleId);
    if (module) {
      setWeights(module.weights);
      setComponents(module.components);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = weights.assignments + weights.exams;
    
    if (total !== 100) {
      alert('Weights must sum to 100%');
      return;
    }
    
    if (selectedModuleId) {
      useStore.setState(state => ({
        years: state.years.map(year => 
          year.id === yearId
            ? {
                ...year,
                modules: year.modules.map(module =>
                  module.id === selectedModuleId
                    ? { ...module, weights, components }
                    : module
                )
              }
            : year
        )
      }));
    }
  };

  const addComponent = (type: 'TD' | 'TP') => {
    setComponents([...components, { type, hours: 1 }]);
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const updateComponentHours = (index: number, hours: number) => {
    setComponents(
      components.map((component, i) =>
        i === index ? { ...component, hours } : component
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label">Select Module</label>
        <select
          value={selectedModuleId}
          onChange={(e) => handleModuleChange(e.target.value)}
          className="input"
          required
        >
          <option value="">Choose a module</option>
          {selectedYear?.modules.map((module) => (
            <option key={module.id} value={module.id}>{module.name}</option>
          ))}
        </select>
      </div>

      {selectedModuleId && (
        <>
          <div className="space-y-4">
            <div>
              <label className="label">Assignments Weight (%)</label>
              <input
                type="number"
                value={weights.assignments}
                onChange={(e) => setWeights(prev => ({ ...prev, assignments: Number(e.target.value) }))}
                className="input"
                min="0"
                max="100"
                required
              />
            </div>

            <div>
              <label className="label">Exams Weight (%)</label>
              <input
                type="number"
                value={weights.exams}
                onChange={(e) => setWeights(prev => ({ ...prev, exams: Number(e.target.value) }))}
                className="input"
                min="0"
                max="100"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Module Components</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addComponent('TD')}
                  className="btn btn-secondary flex items-center gap-1"
                >
                  <Plus size={16} /> Add TD
                </button>
                <button
                  type="button"
                  onClick={() => addComponent('TP')}
                  className="btn btn-secondary flex items-center gap-1"
                >
                  <Plus size={16} /> Add TP
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {components.map((component, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium w-24">{component.type}</span>
                  <div className="flex-1">
                    <label className="label">Hours per Week</label>
                    <input
                      type="number"
                      value={component.hours}
                      onChange={(e) => updateComponentHours(index, Number(e.target.value))}
                      className="input"
                      min="1"
                      required
                    />
                  </div>
                  {component.type !== 'Course' && (
                    <button
                      type="button"
                      onClick={() => removeComponent(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full flex items-center justify-center">
            <Save size={18} className="mr-2" />
            Save Settings
          </button>
        </>
      )}
    </form>
  );
}