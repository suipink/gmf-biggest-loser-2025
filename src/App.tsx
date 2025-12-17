import { useState, useEffect } from 'react';
import Leaderboard from './components/Leaderboard';
import WeighInPanel from './components/WeighInPanel';
import { CompetitorEntry } from './utils/logic';
import { LocalStorageService } from './services/localStorageService';

const competitorData: CompetitorEntry[] = [
  {
    name: "Sarah Chen",
    baselineWeight: 85,
    currentWeight: 78.03,
    profilePic: "https://images.unsplash.com/photo-1494790108755-2616b2e8a5cd?w=200&h=200&fit=crop&crop=face",
    cheerer: "Team Thunder ⚡",
    weighIns: [
      { date: "2025-01-01", weight: 85 },
      { date: "2025-01-15", weight: 82.5 },
      { date: "2025-02-01", weight: 80.2 },
      { date: "2025-02-15", weight: 78.03 }
    ]
  },
  {
    name: "Mike Rodriguez",
    baselineWeight: 120,
    currentWeight: 108.5,
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    cheerer: "Fitness Warriors 🏋️‍♂️",
    weighIns: [
      { date: "2025-01-01", weight: 120 },
      { date: "2025-01-15", weight: 116.8 },
      { date: "2025-02-01", weight: 112.3 },
      { date: "2025-02-15", weight: 108.5 }
    ]
  },
  {
    name: "Emma Johnson",
    baselineWeight: 95,
    currentWeight: 87.2,
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    cheerer: "Dream Team 💫",
    weighIns: [
      { date: "2025-01-01", weight: 95 },
      { date: "2025-01-15", weight: 92.1 },
      { date: "2025-02-01", weight: 89.5 },
      { date: "2025-02-15", weight: 87.2 }
    ]
  },
  {
    name: "David Kim",
    baselineWeight: 110,
    currentWeight: 101.5,
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    cheerer: "Iron Eagles 🦅",
    weighIns: [
      { date: "2025-01-01", weight: 110 },
      { date: "2025-01-15", weight: 107.2 },
      { date: "2025-02-01", weight: 104.8 },
      { date: "2025-02-15", weight: 101.5 }
    ]
  },
  {
    name: "Lisa Thompson",
    baselineWeight: 90,
    currentWeight: 83.7,
    profilePic: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face",
    cheerer: "Phoenix Rising 🔥",
    weighIns: [
      { date: "2025-01-01", weight: 90 },
      { date: "2025-01-15", weight: 87.8 },
      { date: "2025-02-01", weight: 85.9 },
      { date: "2025-02-15", weight: 83.7 }
    ]
  },
  {
    name: "Alex Martinez",
    baselineWeight: 105,
    currentWeight: 98.8,
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    cheerer: "Victory Wolves 🐺",
    weighIns: [
      { date: "2025-01-01", weight: 105 },
      { date: "2025-01-15", weight: 103.2 },
      { date: "2025-02-01", weight: 101.1 },
      { date: "2025-02-15", weight: 98.8 }
    ]
  }
];

function App() {
  const [competitors, setCompetitors] = useState<CompetitorEntry[]>(competitorData);
  const [showAdmin, setShowAdmin] = useState(false);
  const [blurPercentages, setBlurPercentages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load competitors from Supabase on component mount
  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = () => {
    try {
      setLoading(true);
      const stored = LocalStorageService.getAllCompetitors();
      if (stored.length > 0) {
        setCompetitors(stored);
      } else {
        // Initialize with sample data if no stored data
        LocalStorageService.saveAllCompetitors(competitorData);
        setCompetitors(competitorData);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load competitors:', err);
      setError('Failed to load data from local storage. Using sample data.');
      setCompetitors(competitorData);
    } finally {
      setLoading(false);
    }
  };

  const addWeighIn = (competitorName: string, date: string, weight: number) => {
    try {
      // Add to local storage
      LocalStorageService.addWeighIn(competitorName, date, weight);

      // Update local state
      setCompetitors(prev => prev.map(competitor => {
        if (competitor.name === competitorName) {
          const newWeighIns = [...competitor.weighIns, { date, weight }];
          const sortedWeighIns = newWeighIns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const latestWeight = sortedWeighIns[sortedWeighIns.length - 1].weight;

          return {
            ...competitor,
            weighIns: sortedWeighIns,
            currentWeight: latestWeight
          };
        }
        return competitor;
      }));

      // Refresh data to ensure consistency
      loadCompetitors();
    } catch (err) {
      console.error('Failed to add weigh-in:', err);
      alert('Failed to add weigh-in. Please try again.');
    }
  };

  return (
    <>
      <section className="hero">
        <h1 className="title">
          <img
            src="GMF Circle Black.png"
            alt="GMF Logo"
            style={{
              height: 'clamp(80px, 12vw, 180px)',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          GMF BIGGEST LOSER
        </h1>
        <span className="belt" aria-hidden="true"></span>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            style={{
              padding: '12px',
              border: 'none',
              borderRadius: '50%',
              background: showAdmin ? '#c0392b' : '#e67e22',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2em',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            title={showAdmin ? 'Show Leaderboard' : 'Admin Panel'}
          >
            {showAdmin ? '📊' : '⚙️'}
          </button>

          {!showAdmin && (
            <button
              className="reveal-btn"
              onClick={() => setBlurPercentages(!blurPercentages)}
              title={blurPercentages ? 'Reveal Percentages' : 'Blur for Screenshot'}
            >
              {blurPercentages ? '👁️ Reveal' : '🫣 Hide'}
            </button>
          )}
        </div>
      </section>

      {error && (
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '12px 20px',
          borderRadius: '8px',
          margin: '20px auto',
          maxWidth: '1600px',
          border: '1px solid #ffeaa7'
        }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <section className="leaderboard center">
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <div style={{ fontSize: '3em', marginBottom: '20px' }}>⏳</div>
            <div style={{ fontSize: '1.2em' }}>Loading competitors data...</div>
          </div>
        </section>
      ) : showAdmin ? (
        <section style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '20px',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          minHeight: '70vh'
        }}>
          <WeighInPanel
            competitors={competitors}
            onAddWeighIn={addWeighIn}
            onDataChange={loadCompetitors}
          />
        </section>
      ) : (
        <section className="leaderboard">
          <Leaderboard
            entries={competitors}
            mode="preFinal"
            showWeights={false}
            blurPercentages={blurPercentages}
          />
        </section>
      )}
    </>
  );
}

export default App;