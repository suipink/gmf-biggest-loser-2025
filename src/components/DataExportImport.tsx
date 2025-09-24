import React, { useState } from 'react';
import { LocalStorageService } from '../services/localStorageService';

interface DataExportImportProps {
  onDataChange: () => void;
}

const DataExportImport: React.FC<DataExportImportProps> = ({ onDataChange }) => {
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    const data = LocalStorageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gmf-leaderboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        LocalStorageService.importData(jsonData);
        alert('Data imported successfully!');
        onDataChange();
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
      } finally {
        setImporting(false);
        event.target.value = ''; // Reset file input
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      LocalStorageService.clearAllData();
      alert('All data cleared!');
      onDataChange();
    }
  };

  const storageInfo = LocalStorageService.getStorageInfo();

  return (
    <div style={{
      background: '#f8f9fa',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>
        💾 Data Management (Local Storage)
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <button
          onClick={handleExport}
          style={{
            padding: '12px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          📥 Export Data
        </button>

        <label style={{
          padding: '12px 20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          textAlign: 'center',
          display: 'block'
        }}>
          {importing ? '⏳ Importing...' : '📤 Import Data'}
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={importing}
            style={{ display: 'none' }}
          />
        </label>

        <button
          onClick={handleClearData}
          style={{
            padding: '12px 20px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🗑️ Clear All Data
        </button>
      </div>

      <div style={{
        marginTop: '20px',
        fontSize: '0.9em',
        color: '#666'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Storage Usage:</strong> {Math.round(storageInfo.used / 1024)} KB used ({storageInfo.percentage}%)
        </div>
        <div style={{
          background: '#e9ecef',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(storageInfo.percentage, 100)}%`,
            height: '100%',
            background: storageInfo.percentage > 80 ? '#dc3545' : '#28a745',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ fontSize: '0.8em', marginTop: '5px', color: '#888' }}>
          💡 Export your data regularly as backup. Data is stored locally on this device.
        </div>
      </div>
    </div>
  );
};

export default DataExportImport;