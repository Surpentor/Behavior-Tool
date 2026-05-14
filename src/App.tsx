import { useState, useEffect } from 'react';
import { StudentData } from './types';
import { parseFile } from './utils/fileParser';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import './styles/App.css';

function App() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (studentData) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [studentData]);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await parseFile(file);
      setStudentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    setStudentData(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 Behavior School Data Tool</h1>
        <p>Load, analyze, and visualize student behavior data</p>
      </header>

      {!studentData ? (
        <FileUpload onFileUpload={handleFileUpload} loading={loading} error={error} />
      ) : (
        <>
          <button className="clear-button" onClick={handleClearData}>
            ← Load Different Student
          </button>
          <Dashboard data={studentData} />
        </>
      )}
    </div>
  );
}

export default App;
