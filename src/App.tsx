import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Academic from './pages/Academic';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import Results from './pages/Results';
import DataInitializer from './components/TestData/DataInitializer';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'academic':
        return <Academic />;
      case 'students':
        return <Students />;
      case 'attendance':
        return <Attendance />;
      case 'grades':
        return <Grades />;
      case 'notes':
        return <Notes />;
      case 'settings':
        return <Settings />;
      case 'results':
        return <Results />;
      default:
        return (
          <div className="card">
            <p className="text-gray-600">Select a section from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onNavigate={setCurrentPage} />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 capitalize">{currentPage}</h1>
            <p className="text-gray-600 mt-2">Manage your classroom with ease</p>
          </header>
          {renderPage()}
        </div>
      </main>
      <DataInitializer />
    </div>
  );
}

export default App;