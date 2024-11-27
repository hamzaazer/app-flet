import React, { useState } from 'react';
import { useStore } from '../store';
import { StickyNote, Search } from 'lucide-react';

export default function Notes() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { students } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const note = {
      id: crypto.randomUUID(),
      title: noteTitle,
      content: noteContent,
      date: new Date().toISOString(),
    };

    // Add note to student
    useStore.setState((state) => ({
      students: state.students.map((student) =>
        student.id === selectedStudent
          ? { ...student, notes: [...student.notes, note] }
          : student
      ),
    }));

    setNoteTitle('');
    setNoteContent('');
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Add Note</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="input"
                required
              >
                <option value="">Choose a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Note Title</label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Content</label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="input min-h-[100px]"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Add Note
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="card">
              <h3 className="text-lg font-semibold mb-3">{student.name}</h3>
              {student.notes.length === 0 ? (
                <div className="text-center py-6">
                  <StickyNote className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-500">No notes yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {student.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 bg-gray-50 rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{note.title}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(note.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}