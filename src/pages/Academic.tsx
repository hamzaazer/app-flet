import React, { useState } from 'react';
import YearForm from '../components/Academic/YearForm';
import SectionForm from '../components/Academic/SectionForm';
import GroupForm from '../components/Academic/GroupForm';
import { useStore } from '../store';

export default function Academic() {
  const [activeTab, setActiveTab] = useState('years');
  const { years, sections, groups } = useStore();

  const tabs = [
    { id: 'years', label: 'Academic Years' },
    { id: 'sections', label: 'Sections' },
    { id: 'groups', label: 'Groups' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            {activeTab === 'years' && 'Create Academic Year'}
            {activeTab === 'sections' && 'Create Section'}
            {activeTab === 'groups' && 'Create Group'}
          </h2>
          {activeTab === 'years' && <YearForm />}
          {activeTab === 'sections' && <SectionForm />}
          {activeTab === 'groups' && <GroupForm />}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            {activeTab === 'years' && 'Academic Years'}
            {activeTab === 'sections' && 'Sections'}
            {activeTab === 'groups' && 'Groups'}
          </h2>
          <div className="space-y-2">
            {activeTab === 'years' && years.map((year) => (
              <div key={year.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{year.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {activeTab === 'sections' && sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{section.name}</p>
                <p className="text-sm text-gray-500">
                  {years.find(y => y.id === section.yearId)?.name}
                </p>
              </div>
            ))}
            {activeTab === 'groups' && groups.map((group) => (
              <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-gray-500">
                  {sections.find(s => s.id === group.sectionId)?.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}