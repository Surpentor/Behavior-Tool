import { useRef } from 'react';
import '../styles/FileUpload.css';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
  error: string | null;
}

export default function FileUpload({ onFileUpload, loading, error }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="file-upload-container">
      <div
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        <div className="upload-content">
          <h2>📁 Upload Student Data</h2>
          <p>Drag and drop your data file here or click to select</p>
          <p className="file-formats">
            Supported: .xls, .xlsx, .csv, .tsv, .ods, .html, .pdf
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xls,.xlsx,.csv,.tsv,.ods,.html,.pdf"
          onChange={handleFileChange}
          disabled={loading}
          style={{ display: 'none' }}
        />
      </div>

      {loading && <p className="loading-message">Processing file...</p>}
      {error && <p className="error-message">Error: {error}</p>}
    </div>
  );
}
