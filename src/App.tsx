import { useState, useEffect } from 'react';
import Leaderboard from './components/Leaderboard';
import RevealSlideshow from './components/RevealSlideshow';
import WeighInPanel from './components/WeighInPanel';
import { CompetitorEntry } from './utils/logic';
import { LocalStorageService } from './services/localStorageService';

const competitorData: CompetitorEntry[] = [
  {
    name: "Benz",
    baselineWeight: 85,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 78.03,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Benz after.jpg",
    beforePhoto: "/images/Benz Original.jpg",
    afterPhoto: "/images/Benz after.jpg",
    cheerer: "Team Thunder ⚡",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 85 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 78.03 }  // UPDATE: Replace with actual last weigh-in
    ]
  },
  {
    name: "Kan",
    baselineWeight: 120,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 108.5,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Kan after.jpg",
    beforePhoto: "/images/Kan Original.jpg",
    afterPhoto: "/images/Kan after.jpg",
    cheerer: "Fitness Warriors 🏋️‍♂️",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 120 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 108.5 }  // UPDATE: Replace with actual last weigh-in
    ]
  },
  {
    name: "Khwan",
    baselineWeight: 95,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 87.2,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Khwan after.jpg",
    beforePhoto: "/images/Khwan Original.jpg",
    afterPhoto: "/images/Khwan after.jpg",
    cheerer: "Dream Team 💫",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 95 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 87.2 }  // UPDATE: Replace with actual last weigh-in
    ]
  },
  {
    name: "Maprang",
    baselineWeight: 110,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 101.5,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Maprang after.jpg",
    beforePhoto: "/images/Maprang Original.jpg",
    afterPhoto: "/images/Maprang after.jpg",
    cheerer: "Iron Eagles 🦅",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 110 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 101.5 }  // UPDATE: Replace with actual last weigh-in
    ]
  },
  {
    name: "Mera",
    baselineWeight: 90,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 83.7,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Mera after.jpg",
    beforePhoto: "/images/Mera Original.jpg",
    afterPhoto: "/images/Mera after.jpg",
    cheerer: "Phoenix Rising 🔥",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 90 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 83.7 }  // UPDATE: Replace with actual last weigh-in
    ]
  },
  {
    name: "Sui",
    baselineWeight: 105,  // UPDATE: Replace with actual first weigh-in weight
    currentWeight: 98.8,  // UPDATE: Replace with actual last weigh-in weight
    profilePic: "/images/Sui After.jpg",
    beforePhoto: "/images/Sui Original.jpg",
    afterPhoto: "/images/Sui After.jpg",
    cheerer: "Victory Wolves 🐺",  // UPDATE: Replace with actual team/cheerer name
    weighIns: [
      { date: "2025-01-01", weight: 105 },  // UPDATE: Replace with actual first weigh-in
      { date: "2025-02-15", weight: 98.8 }  // UPDATE: Replace with actual last weigh-in
    ]
  }
];

function App() {
  const [competitors, setCompetitors] = useState<CompetitorEntry[]>(competitorData);
  const [showAdmin, setShowAdmin] = useState(false);
  const [blurPercentages, setBlurPercentages] = useState(false);
  const [revealMode, setRevealMode] = useState(false);
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
            <>
              <button
                className="reveal-btn"
                onClick={() => setRevealMode(!revealMode)}
                title={revealMode ? 'Show All Rankings' : 'Reveal Mode (6th to 1st)'}
              >
                {revealMode ? '📊 Leaderboard' : '🎬 Reveal Show'}
              </button>

              {!revealMode && (
                <button
                  className="reveal-btn"
                  onClick={() => setBlurPercentages(!blurPercentages)}
                  title={blurPercentages ? 'Reveal Percentages' : 'Blur for Screenshot'}
                >
                  {blurPercentages ? '👁️ Reveal' : '🫣 Hide'}
                </button>
              )}
            </>
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
      ) : revealMode ? (
        <section style={{ minHeight: '80vh' }}>
          <RevealSlideshow
            entries={competitors}
            mode="preFinal"
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