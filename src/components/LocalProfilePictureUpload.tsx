import React, { useState } from 'react';
import { LocalStorageService } from '../services/localStorageService';

interface LocalProfilePictureUploadProps {
  competitorName: string;
  currentPictureUrl?: string;
  onUploadSuccess: (newUrl: string) => void;
}

const LocalProfilePictureUpload: React.FC<LocalProfilePictureUploadProps> = ({
  competitorName,
  currentPictureUrl,
  onUploadSuccess
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit for localStorage
      alert('File size must be less than 2MB for local storage');
      return;
    }

    try {
      setUploading(true);
      const base64Url = await LocalStorageService.storeProfileImage(competitorName, file);
      onUploadSuccess(base64Url);
      alert(`Profile picture updated for ${competitorName}!`);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#333'
      }}>
        Profile Picture for {competitorName}:
      </label>

      {currentPictureUrl && (
        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
          <img
            src={currentPictureUrl}
            alt={`${competitorName} current profile`}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: '3px solid #e9ecef'
            }}
          />
          <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
            Current Picture
          </div>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: `2px dashed ${dragOver ? '#28a745' : '#dee2e6'}`,
          borderRadius: '8px',
          padding: '30px',
          textAlign: 'center',
          background: dragOver ? '#f8f9fa' : 'white',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        {uploading ? (
          <div>
            <div style={{ fontSize: '1.5em', marginBottom: '10px' }}>⏳</div>
            <div>Processing image...</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>📷</div>
            <div style={{ marginBottom: '10px', color: '#666' }}>
              Drag & drop an image here, or click to select
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #dee2e6',
                background: '#f8f9fa',
                cursor: 'pointer'
              }}
            />
          </div>
        )}
      </div>

      <div style={{
        fontSize: '0.8em',
        color: '#6c757d',
        marginTop: '8px',
        textAlign: 'center'
      }}>
        📱 Stored locally on this device • JPG, PNG, GIF • Max: 2MB
      </div>
    </div>
  );
};

export default LocalProfilePictureUpload;