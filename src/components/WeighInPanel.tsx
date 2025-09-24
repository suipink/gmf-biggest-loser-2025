import React, { useState } from 'react';
import { CompetitorEntry } from '../utils/logic';

interface WeighInPanelProps {
  competitors: CompetitorEntry[];
  onAddWeighIn: (competitorName: string, date: string, weight: number) => void;
}

const WeighInPanel: React.FC<WeighInPanelProps> = ({ competitors, onAddWeighIn }) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCompetitor && date && weight) {
      onAddWeighIn(selectedCompetitor, date, parseFloat(weight));
      setWeight('');
      alert(`Added weigh-in for ${selectedCompetitor}: ${weight}kg on ${date}`);
    }
  };

  return (
    <div style={{
      background: '#f8f9fa',
      borderRadius: '16px',
      padding: '30px'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333'
      }}>
        ⚙️ Admin Panel - Add New Weigh-In
      </h2>

      <form onSubmit={handleSubmit} style={{
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333'
          }}>
            Select Competitor:
          </label>
          <select
            value={selectedCompetitor}
            onChange={(e) => setSelectedCompetitor(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e9ecef',
              fontSize: '1em'
            }}
            required
          >
            <option value="">Choose a competitor...</option>
            {competitors.map(competitor => (
              <option key={competitor.name} value={competitor.name}>
                {competitor.name} ({competitor.cheerer})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333'
          }}>
            Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e9ecef',
              fontSize: '1em'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333'
          }}>
            Weight (kg):
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in kg"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e9ecef',
              fontSize: '1em'
            }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1em',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
        >
          📝 Add Weigh-In
        </button>
      </form>

      {selectedCompetitor && (
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>
            📊 {selectedCompetitor}'s Weigh-In History
          </h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {competitors
              .find(c => c.name === selectedCompetitor)
              ?.weighIns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((weighIn, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: index === 0 ? 'none' : '1px solid #eee'
                  }}
                >
                  <span>{weighIn.date}</span>
                  <span style={{ fontWeight: '600' }}>{weighIn.weight}kg</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeighInPanel;