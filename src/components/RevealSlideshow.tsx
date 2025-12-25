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
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < sortedRankings.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setShowReveal(false);

      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsAnimating(false);
      }, 600);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setShowReveal(false);

      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsAnimating(false);
      }, 600);
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

  return (
    <div className="reveal-container">
      {/* Main Reveal Card - Horizontal Scorecard Layout */}
      <div className={`reveal-card ${showReveal ? 'show' : ''} ${getRankClass(currentRanking.rank)} ${isTopThree ? 'top-three-card' : ''}`}>

        {/* Left Side: Before/After Photos */}
        <div className="scorecard-left">
          <div className="photo-comparison">
            <div className="photo-item">
              <div className="photo-label-small">BEFORE</div>
              <img
                src={currentRanking.beforePhoto || currentRanking.profilePic}
                alt={`${currentRanking.name} before`}
                className="scorecard-photo"
              />
              <div className="weight-label-small">{currentRanking.weighIns[0]?.weight.toFixed(1)} kg</div>
            </div>

            <div className="arrow-vertical">↓</div>

            <div className="photo-item">
              <div className="photo-label-small">AFTER</div>
              <img
                src={currentRanking.afterPhoto || currentRanking.profilePic}
                alt={`${currentRanking.name} after`}
                className="scorecard-photo"
              />
              <div className="weight-label-small">{currentRanking.weighIns[currentRanking.weighIns.length - 1]?.weight.toFixed(1)} kg</div>
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
