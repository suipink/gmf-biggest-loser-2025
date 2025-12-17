import React, { useState, useEffect } from 'react';
import { LocalStorageService } from '../services/localStorageService';
import { CompetitorEntry } from '../utils/logic';
import LocalProfilePictureUpload from './LocalProfilePictureUpload';

interface CompetitorEditorProps {
  competitor: CompetitorEntry;
  onUpdate: () => void;
}

const CompetitorEditor: React.FC<CompetitorEditorProps> = ({ competitor, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(competitor.name);
  const [newCheerer, setNewCheerer] = useState(competitor.cheerer);
  const [editingWeighIn, setEditingWeighIn] = useState<string | null>(null);
  const [editWeighInData, setEditWeighInData] = useState<{ date: string; weight: string }>({ date: '', weight: '' });

  // Reset state when competitor changes
  useEffect(() => {
    setNewName(competitor.name);
    setNewCheerer(competitor.cheerer);
    setEditingWeighIn(null);
    setEditWeighInData({ date: '', weight: '' });
  }, [competitor.name, competitor.cheerer]);

  const handleSave = () => {
    try {
      if (newName.trim() === '') {
        alert('Name cannot be empty');
        return;
      }

      if (newCheerer.trim() === '') {
        alert('กองเชียร์ cannot be empty');
        return;
      }

      LocalStorageService.updateCompetitor(competitor.name, {
        name: newName.trim(),
        cheerer: newCheerer.trim()
      });

      onUpdate();
      alert(`Updated ${competitor.name} successfully! You can continue editing or click the 📊 button to return to leaderboard.`);
    } catch (error) {
      console.error('Failed to update competitor:', error);
      alert('Failed to update competitor. Please try again.');
    }
  };

  const handleCancel = () => {
    setNewName(competitor.name);
    setNewCheerer(competitor.cheerer);
    setEditing(false);
    setEditingWeighIn(null);
  };

  const handleEditWeighIn = (date: string, weight: number) => {
    setEditingWeighIn(date);
    setEditWeighInData({ date, weight: weight.toString() });
  };

  const handleSaveWeighIn = () => {
    try {
      if (!editingWeighIn || !editWeighInData.date || !editWeighInData.weight) {
        alert('Please fill in both date and weight');
        return;
      }

      const weight = parseFloat(editWeighInData.weight);
      if (isNaN(weight) || weight <= 0) {
        alert('Please enter a valid weight');
        return;
      }

      LocalStorageService.updateWeighIn(competitor.name, editingWeighIn, editWeighInData.date, weight);
      setEditingWeighIn(null);
      setEditWeighInData({ date: '', weight: '' });
      onUpdate();
      alert('Weigh-in updated successfully! Changes saved.');
    } catch (error) {
      console.error('Failed to update weigh-in:', error);
      alert('Failed to update weigh-in. Please try again.');
    }
  };

  const handleDeleteWeighIn = (date: string, weight: number) => {
    if (confirm(`Are you sure you want to delete the weigh-in from ${date} (${weight}kg)?`)) {
      try {
        console.log(`🗑️ DELETING: ${competitor.name} on ${date} with weight ${weight}kg`);
        console.log(`📊 BEFORE DELETE:`, competitor.weighIns);

        LocalStorageService.deleteWeighIn(competitor.name, date, weight);

        // Check what's left after deletion
        const updatedCompetitors = LocalStorageService.getAllCompetitors();
        const updatedCompetitor = updatedCompetitors.find(c => c.name === competitor.name);
        console.log(`📊 AFTER DELETE:`, updatedCompetitor?.weighIns);

        onUpdate();
        alert('Weigh-in deleted successfully! Changes saved.');
      } catch (error) {
        console.error('Failed to delete weigh-in:', error);
        alert('Failed to delete weigh-in. Please try again.');
      }
    }
  };

  if (editing) {
    return (
      <div style={{
        background: '#f8f9fa',
        border: '2px solid #007bff',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '10px'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
          ✏️ Editing {competitor.name}
        </h4>

        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '600',
            color: '#333'
          }}>
            Name:
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1em'
            }}
            placeholder="Enter competitor name"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '600',
            color: '#333'
          }}>
            กองเชียร์ (Cheerer):
          </label>
          <input
            type="text"
            value={newCheerer}
            onChange={(e) => setNewCheerer(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1em',
              fontFamily: 'Kanit, sans-serif'
            }}
            placeholder="Enter กองเชียร์ name"
          />
        </div>

        {/* Profile Picture Upload */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: '#333'
          }}>
            Profile Picture:
          </label>

          {competitor.profilePic && (
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
              <img
                src={competitor.profilePic}
                alt={`${competitor.name} profile`}
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

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              console.log(`🖼️ Starting profile picture upload for ${competitor.name}`, file);

              if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
              }

              if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
              }

              try {
                console.log('📁 Using LocalStorageService to store profile image...');
                const base64 = await LocalStorageService.storeProfileImage(competitor.name, file);
                console.log('✅ Profile picture stored successfully:', base64.substring(0, 50) + '...');

                // Debug: Check what's actually stored
                console.log('🔍 Checking localStorage after update...');
                const storedCompetitors = LocalStorageService.getAllCompetitors();
                const updatedCompetitor = storedCompetitors.find(c => c.name === competitor.name);
                console.log('📝 Updated competitor data:', updatedCompetitor);

                const storedImages = LocalStorageService.getStoredImages();
                console.log('🖼️ All stored images:', Object.keys(storedImages));

                alert(`Profile picture updated for ${competitor.name}!`);

                // Update the parent component
                onUpdate();
              } catch (error) {
                console.error('❌ Upload failed:', error);
                alert(`Failed to upload profile picture: ${error.message}`);
              }
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1em',
              cursor: 'pointer'
            }}
          />
          <div style={{
            fontSize: '0.8em',
            color: '#6c757d',
            marginTop: '5px'
          }}>
            📱 JPG, PNG, GIF • Max: 2MB
          </div>
        </div>

        {/* Editable Weigh-In History */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: '#333'
          }}>
            📊 Weigh-In History:
          </label>
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            backgroundColor: '#f9f9f9'
          }}>
            {competitor.weighIns
              .slice() // Create a copy to avoid mutating original
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort newest first
              .map((weighIn, index) => {
                // Debug: Check for potential duplicate dates
                const duplicates = competitor.weighIns.filter(w => w.date === weighIn.date);
                if (duplicates.length > 1) {
                  console.log(`⚠️ DUPLICATE DATES FOUND for ${weighIn.date}:`, duplicates);
                }

                return (
                <div key={`${competitor.name}-${weighIn.date}-${weighIn.weight}-${index}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  marginBottom: '8px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #eee'
                }}>
                  {editingWeighIn === weighIn.date ? (
                    // Edit mode
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <input
                        type="date"
                        value={editWeighInData.date}
                        onChange={(e) => setEditWeighInData(prev => ({ ...prev, date: e.target.value }))}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          fontSize: '0.9em'
                        }}
                      />
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={editWeighInData.weight}
                        onChange={(e) => setEditWeighInData(prev => ({ ...prev, weight: e.target.value }))}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          fontSize: '0.9em',
                          width: '80px'
                        }}
                        placeholder="kg"
                      />
                      <button
                        onClick={handleSaveWeighIn}
                        style={{
                          padding: '4px 8px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8em'
                        }}
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => setEditingWeighIn(null)}
                        style={{
                          padding: '4px 8px',
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8em'
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '0.9em' }}>{weighIn.date}</span>
                        <span style={{ fontWeight: '600', fontSize: '0.9em' }}>{weighIn.weight}kg</span>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => handleEditWeighIn(weighIn.date, weighIn.weight)}
                          style={{
                            padding: '4px 8px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8em'
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteWeighIn(weighIn.date, weighIn.weight)}
                          style={{
                            padding: '4px 8px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8em'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
                );
              })}
            {competitor.weighIns.length === 0 && (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No weigh-in records found
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ✅ Save Changes
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <div style={{ fontWeight: '600', fontSize: '1.1em', color: '#333' }}>
          {competitor.name}
        </div>
        <div style={{
          color: '#666',
          fontSize: '0.9em',
          fontFamily: 'Kanit, sans-serif',
          marginTop: '5px'
        }}>
          กองเชียร์: {competitor.cheerer}
        </div>
      </div>
      <button
        onClick={() => setEditing(true)}
        style={{
          padding: '6px 12px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9em',
          fontWeight: '600'
        }}
      >
        ✏️ Edit
      </button>
    </div>
  );
};

export default CompetitorEditor;