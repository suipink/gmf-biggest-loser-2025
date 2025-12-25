import React, { useState, useEffect } from 'react';
import { computeRankings, CompetitorEntry } from '../utils/logic';
import { formatPercentage } from '../utils/format';

interface RevealSlideshowProps {
  entries: CompetitorEntry[];
  mode: "preFinal" | "final";
}

const getEmojiForRank = (rank: number): string => {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    case 4: return '4️⃣';
    case 5: return '5️⃣';
    case 6: return '6️⃣';
    default: return '❓';
  }
};

const getCheererBadgeContent = (cheerer: string) => {
  const emojiMatch = cheerer.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23EC}]|[\u{23F0}]|[\u{23F3}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]/gu);
  return emojiMatch ? emojiMatch[0] : '⭐';
};

const getRankClass = (rank: number) => {
  return `rank-${rank}`;
};

const RevealSlideshow: React.FC<RevealSlideshowProps> = ({ entries, mode }) => {
  const rankings = computeRankings(entries, mode);

  // Sort rankings from 6th to 1st (reverse order)
  const sortedRankings = [...rankings]
    .filter(r => !r.hasInsufficientData && r.rank > 0)
    .sort((a, b) => b.rank - a.rank);

  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentRanking = sortedRankings[currentIndex];
  const isLastReveal = currentIndex === sortedRankings.length - 1;
  const isTopThree = currentRanking && currentRanking.rank <= 3;

  useEffect(() => {
    // Trigger reveal animation after component mounts
    const timer = setTimeout(() => {
      setShowReveal(true);

      // Play sound effect for top 3 rankings
      if (currentRanking && currentRanking.rank <= 3) {
        const audio = new Audio();

        if (currentRanking.rank === 1) {
          // Victory fanfare for 1st place
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYmNkZWZn6Olp6mrrK2ur7CxsrKzs7S0tLS0tLOzs7KysrGxsK+urayrqainpaSioJ+dnZuamZiXlpWUk5KRkJCPj4+Pj4+QkJGRkpKTlJSVlpeYmZqbnJ2en6ChoqOnqKmqq6ytr6+wsbKztLS1tba2t7e4uLi4uLi3t7a2tbW0s7OysrGwr62sq6qpp6akoqCfnZuamJaUkpCOjIqIhoSCgH58enh2dHJwbmxqaGZkYmBfXVtaWFdWVVRTUlJRUVBQUFBQUFBRUVJSU1RVVldYWVpbXV5fYGFiZGVmZ2hpamtsbW5vcHFyc3R1dnd4eHl6e3x9fn+AgYKDhIWFhoaHh4iIiIiIiIiHh4aGhYWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUVBQT09PT1BQUFFRUlJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3Bxcm50dXZ3d3h5ent8fX5/gIGCg4SFhoaHiIiJiYmJiYmJiYiIh4eGhYWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUVBQUFBQUFBQUVFSUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dXZ3eHl6e3x9fn+AgYKDhIWGh4eIiYmKioqKioqKiomJiIeHhoWFhIKCgYB/fn18e3p5eHd2dXRzcnFwb25tbGppaWhnZWRjYmFgX15dXFtaWVhXVlVUU1NSUVRQUFJQU1NUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHh4iJiYqKi4uLi4uLi4qKiYmIh4aGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramlnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUlFRUFBQUFBQUVFSUlNUVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3d3h5ent8fX5/gIGCg4SFhoaHiIiJiYmJiYmJiYiIh4eGhYWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUVBQUFBQUFBQUVFSUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dXZ3eHl6e3x9fn+AgYKDhIWGh4eIiYmKioqKioqKiomJiIeHhoWFhIKCgYB/fn18e3p5eHd2dXRzcnFwb25tbGppaWhnZWRjYmFgX15dXFtaWVhXVlVUU1NSUVRQUFJQU1NUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHh4iJiYqKi4uLi4uLi4qKiYmIh4aGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramlnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUlFRUFBQUFBQUVFSUlNUVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGhoeIiImJiYmJiYmIiIeHhoWFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVFQUFBQUFBQUVFSUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiIiJiYqKioqKioqJiYiHh4aFhIKCgX9+fXx7enl4d3Z1dHNycW9ubWxraWhnZmRjYmFgXl1cW1pYV1ZUUVBQT09PUFBRU1RVVlhZWlxdXl9gYWNkZWZnaGlqa21ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iIiYmKiYmJiYiIh4aGhYSEg4GAgH99fHt6eXd2dXRycXBvbmxraWhnaGdmZGNiYF9eXFtaWVdWVVNSUVBPT05OTk5PT1BRUlNUVVZXWVpbXF1eX2BhYmNlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiYqKioqKiomJiIeGhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUVBQUFBQUFBQUVFSUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiIiJiYqKi4uLi4uLi4qKiYmIh4eGhYWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUFBQTw==';
        } else if (currentRanking.rank === 2) {
          // Silver medal sound for 2nd place
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==';
        } else if (currentRanking.rank === 3) {
          // Bronze medal sound for 3rd place
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAB/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8=';
        }

        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [currentIndex, currentRanking]);

  const handleNext = () => {
    if (currentIndex < sortedRankings.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setShowReveal(false);

      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);

      setTimeout(() => {
        setIsAnimating(false);
      }, 900);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setShowReveal(false);

      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
      }, 300);

      setTimeout(() => {
        setIsAnimating(false);
      }, 900);
    }
  };

  if (!currentRanking) {
    return (
      <div style={{ textAlign: 'center', color: '#fff', padding: '40px' }}>
        <div style={{ fontSize: '3em', marginBottom: '20px' }}>🏆</div>
        <div style={{ fontSize: '1.5em' }}>No rankings available</div>
      </div>
    );
  }

  // Pre-reveal screen
  if (!hasStarted) {
    return (
      <div className="pre-reveal-screen">
        <div className="pre-reveal-content">
          <div className="pre-reveal-icon">🏆</div>
          <h2 className="pre-reveal-title">GMF BIGGEST LOSER 2025</h2>
          <p className="pre-reveal-subtitle">The Results Are In</p>
          <button
            className="start-reveal-button"
            onClick={() => setHasStarted(true)}
          >
            START REVEAL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reveal-container">
      {/* Main Reveal Card - Horizontal Scorecard Layout */}
      <div key={currentRanking.name} className={`reveal-card ${showReveal ? 'show' : ''} ${getRankClass(currentRanking.rank)} ${isTopThree ? 'top-three-card' : ''}`}>

        {/* Left Side: Before/After Photos - Side by Side */}
        <div className="scorecard-left">
          <div className="photo-comparison-horizontal">
            <div className="photo-item-large">
              <div className="photo-label-large">BEFORE</div>
              <img
                key={`before-${currentRanking.name}`}
                src={currentRanking.beforePhoto || currentRanking.profilePic}
                alt={`${currentRanking.name} before`}
                className="scorecard-photo-large"
              />
              <div className="weight-label-large">{currentRanking.weighIns[0]?.weight.toFixed(1)} kg</div>
            </div>

            <div className="arrow-horizontal">→</div>

            <div className="photo-item-large">
              <div className="photo-label-large">AFTER</div>
              <img
                key={`after-${currentRanking.name}`}
                src={currentRanking.afterPhoto || currentRanking.profilePic}
                alt={`${currentRanking.name} after`}
                className="scorecard-photo-large"
              />
              <div className="weight-label-large">{currentRanking.weighIns[currentRanking.weighIns.length - 1]?.weight.toFixed(1)} kg</div>
            </div>
          </div>
        </div>

        {/* Right Side: Info */}
        <div className="scorecard-right">
          {/* Rank Badge */}
          <div className={`rank-badge-scorecard ${getRankClass(currentRanking.rank)}`}>
            <div className="rank-emoji-large">{getEmojiForRank(currentRanking.rank)}</div>
            <div className="rank-text-scorecard">
              {currentRanking.rank === 1 ? 'WINNER!' : `${currentRanking.rank}${getRankSuffix(currentRanking.rank)} PLACE`}
            </div>
          </div>

          {/* Name */}
          <h2 className="competitor-name-scorecard">{currentRanking.name}</h2>

          {/* Team */}
          <div className="team-name-scorecard">
            <span className="team-emoji">{getCheererBadgeContent(currentRanking.cheerer)}</span>
            {currentRanking.cheerer}
          </div>

          {/* Stats */}
          <div className="stats-scorecard">
            <div className="stat-item-scorecard">
              <div className="stat-label-scorecard">{currentRanking.percentLoss >= 0 ? 'Weight Loss' : 'Weight Gain'}</div>
              <div className="stat-value-scorecard" style={{ color: currentRanking.percentLoss >= 0 ? '#22c55e' : '#ef4444' }}>
                {formatPercentage(Math.abs(currentRanking.percentLoss))}
              </div>
            </div>

            <div className="stat-divider-scorecard"></div>

            <div className="stat-item-scorecard">
              <div className="stat-label-scorecard">{currentRanking.kgLoss >= 0 ? 'Total Lost' : 'Total Gain'}</div>
              <div className="stat-value-scorecard" style={{ color: currentRanking.kgLoss >= 0 ? '#22c55e' : '#ef4444' }}>
                {Math.abs(currentRanking.kgLoss).toFixed(1)} kg
              </div>
            </div>
          </div>

          {currentRanking.waApplied && (
            <div className="wa-badge-scorecard">
              Anti-dehydration applied
            </div>
          )}
        </div>

        {/* Top 3 Extra Decorations */}
        {currentRanking.rank === 1 && (
          <div className="crown-decoration">👑</div>
        )}
        {currentRanking.rank === 3 && (
          <div className="fire-decoration">🔥</div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="reveal-controls">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || isAnimating}
          className="nav-button"
          style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
        >
          ← Previous
        </button>

        <div className="progress-indicator">
          {currentIndex + 1} / {sortedRankings.length}
        </div>

        <button
          onClick={handleNext}
          disabled={isLastReveal || isAnimating}
          className="nav-button"
          style={{ visibility: isLastReveal ? 'hidden' : 'visible' }}
        >
          Next →
        </button>
      </div>

      {isLastReveal && showReveal && (
        <div className="finale-message">
          <div className="confetti-rain">🎉 🎊 🎉 🎊 🎉</div>
          <h3 style={{ color: '#FFD700', fontSize: 'clamp(30px, 6vw, 60px)', margin: '20px 0' }}>
            Congratulations to all participants!
          </h3>
        </div>
      )}

      {/* Reset Button */}
      <button
        className="reset-button"
        onClick={() => {
          setHasStarted(false);
          setCurrentIndex(0);
          setShowReveal(false);
        }}
        title="Reset to start"
      >
        ⟲
      </button>
    </div>
  );
};

function getRankSuffix(rank: number): string {
  if (rank === 1) return 'st';
  if (rank === 2) return 'nd';
  if (rank === 3) return 'rd';
  return 'th';
}

export default RevealSlideshow;
