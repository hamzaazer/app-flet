import React from 'react';
import { useStore } from '../../store';

export default function DataInitializer() {
  const { addYear, addSection, addGroup, addStudent, addModule } = useStore();

  const initializeData = () => {
    // Add Academic Years
    const year2024 = {
      id: crypto.randomUUID(),
      name: '2023-2024',
      startDate: '2023-09-01',
      endDate: '2024-06-30',
    };
    addYear(year2024);

    // Add Sections
    const sectionCS = {
      id: crypto.randomUUID(),
      name: 'Computer Science',
      yearId: year2024.id,
    };
    const sectionMath = {
      id: crypto.randomUUID(),
      name: 'Mathematics',
      yearId: year2024.id,
    };
    addSection(sectionCS);
    addSection(sectionMath);

    // Add Groups
    const groupCS1 = {
      id: crypto.randomUUID(),
      name: 'CS Group 1',
      sectionId: sectionCS.id,
    };
    const groupCS2 = {
      id: crypto.randomUUID(),
      name: 'CS Group 2',
      sectionId: sectionCS.id,
    };
    addGroup(groupCS1);
    addGroup(groupCS2);

    // Add Modules
    const moduleAlgorithms = {
      id: crypto.randomUUID(),
      name: 'Algorithms',
      weights: { assignments: 40, exams: 60 },
      components: [
        { type: 'Course', hours: 2 },
        { type: 'TD', hours: 1.5 },
        { type: 'TP', hours: 1.5 }
      ]
    };
    const moduleDatabase = {
      id: crypto.randomUUID(),
      name: 'Database Systems',
      weights: { assignments: 40, exams: 60 },
      components: [
        { type: 'Course', hours: 2 },
        { type: 'TD', hours: 1.5 },
        { type: 'TP', hours: 1.5 }
      ]
    };
    addModule(year2024.id, moduleAlgorithms);
    addModule(year2024.id, moduleDatabase);

    // Add Students with module-specific attendance
    const students = [
      {
        id: crypto.randomUUID(),
        name: 'John Smith',
        age: 20,
        yearId: year2024.id,
        sectionId: sectionCS.id,
        groupId: groupCS1.id,
        attendance: [
          {
            id: crypto.randomUUID(),
            date: '2024-03-01',
            moduleId: moduleAlgorithms.id,
            componentType: 'Course',
            isPresent: true,
            points: 0.5,
          },
          {
            id: crypto.randomUUID(),
            date: '2024-03-01',
            moduleId: moduleDatabase.id,
            componentType: 'TD',
            isPresent: true,
            points: 0.5,
          }
        ],
        grades: [
          {
            id: crypto.randomUUID(),
            type: 'assignment',
            moduleId: moduleAlgorithms.id,
            componentType: 'TD',
            name: 'Algorithm Analysis',
            score: 16,
            maxScore: 20,
            date: '2024-03-01',
          },
        ],
        notes: [
          {
            id: crypto.randomUUID(),
            title: 'Project Progress',
            content: 'Excellent work on the sorting algorithms project',
            date: '2024-03-01',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: 'Emma Johnson',
        age: 19,
        yearId: year2024.id,
        sectionId: sectionCS.id,
        groupId: groupCS1.id,
        attendance: [],
        grades: [],
        notes: [],
      },
      {
        id: crypto.randomUUID(),
        name: 'Michael Brown',
        age: 21,
        yearId: year2024.id,
        sectionId: sectionCS.id,
        groupId: groupCS2.id,
        attendance: [],
        grades: [],
        notes: [],
      },
      {
        id: crypto.randomUUID(),
        name: 'Sarah Davis',
        age: 20,
        yearId: year2024.id,
        sectionId: sectionCS.id,
        groupId: groupCS2.id,
        attendance: [],
        grades: [],
        notes: [],
      },
    ];

    students.forEach(addStudent);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={initializeData}
        className="btn btn-primary"
      >
        Initialize Test Data
      </button>
    </div>
  );
}