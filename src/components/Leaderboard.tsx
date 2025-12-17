import React from 'react';
import { computeRankings, CompetitorEntry, RankingResult } from '../utils/logic';
import { rankToBadge, formatPercentage } from '../utils/format';

interface LeaderboardProps {
  entries: CompetitorEntry[];
  mode: "preFinal" | "final";
  showWeights?: boolean;
  blurPercentages?: boolean;
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

const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  mode,
  showWeights = false,
  blurPercentages = false
}) => {
  const rankings = computeRankings(entries, mode);

  // Ensure cards are sorted by rank for display (rank 1, 2, 3, etc.)
  const sortedRankings = [...rankings].sort((a, b) => {
    // Put entries with insufficient data at the end
    if (a.hasInsufficientData && !b.hasInsufficientData) return 1;
    if (!a.hasInsufficientData && b.hasInsufficientData) return -1;
    if (a.hasInsufficientData && b.hasInsufficientData) return a.name.localeCompare(b.name);

    // Sort by rank (1, 2, 3, etc.)
    return a.rank - b.rank;
  });

  const getRankClass = (rank: number, hasInsufficientData: boolean) => {
    if (hasInsufficientData || rank === -1) return 'rank-n';
    return `rank-${rank}`;
  };

  const getCheererBadgeContent = (cheerer: string) => {
    // Extract emoji from cheerer string with comprehensive regex
    const emojiMatch = cheerer.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23EC}]|[\u{23F0}]|[\u{23F3}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]/gu);
    return emojiMatch ? emojiMatch[0] : '⭐';
  };

  return (
    <>
      {sortedRankings.map((ranking) => (
        <div
          key={ranking.name}
          className={`card ${getRankClass(ranking.rank, ranking.hasInsufficientData || false)}`}
        >
          {/* Rank Badge */}
          <div className={`rank-badge ${getRankClass(ranking.rank, ranking.hasInsufficientData || false)}`} aria-label={`Rank ${ranking.rank} medal`}>
            <span className="emoji">{getEmojiForRank(ranking.rank)}</span>
          </div>

          {/* Avatar with Cheerer Badge */}
          <div style={{ position: 'relative' }}>
            <img
              src={ranking.profilePic}
              alt={`${ranking.name} profile`}
              className="avatar"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLDivElement;
                if (fallback) fallback.style.display = 'grid';
              }}
            />
            <div className="avatar" style={{ display: 'none' }}>
              {ranking.name.split(' ').map(name => name[0]).join('')}
            </div>

            {/* Single Cheerer Badge on Avatar */}
            <div className="cheerer-badge" aria-label={`Team: ${ranking.cheerer}`}>
              {getCheererBadgeContent(ranking.cheerer)}
            </div>
          </div>

          {/* Card Content */}
          <div>
            <h3>{ranking.name}</h3>
            <div className="meta">
              <div style={{ fontFamily: 'Kanit, sans-serif', marginBottom: '8px' }}>
                กองเชียร์: <strong>{ranking.cheerer}</strong>
              </div>
              <div style={{ marginBottom: '12px', color: '#6b7280', fontSize: '0.95em', fontFamily: 'Kanit, sans-serif' }}>
                ชั่งล่าสุด: {(() => {
                  const sortedWeighIns = [...ranking.weighIns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                  const lastDate = sortedWeighIns[0]?.date;
                  return lastDate ? new Date(lastDate).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'ไม่มีข้อมูล';
                })()}
              </div>
              <div style={{ whiteSpace: 'nowrap', width: '100%' }}>
                {ranking.hasInsufficientData ? (
                  <span className={`weight ${blurPercentages ? 'is-hidden' : ''}`} style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)' }}>N/A</span>
                ) : (
                  <span
                    className={`weight ${blurPercentages ? 'is-hidden' : ''}`}
                    style={{
                      fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
                      display: 'block',
                      lineHeight: '1.2',
                      color: ranking.percentLoss > 0 ? '#22c55e' : '#ef4444'
                    }}
                  >
                    {ranking.percentLoss > 0 ? '↓' : '↑'} {formatPercentage(Math.abs(ranking.percentLoss))}
                    {Math.abs(ranking.kgLoss) > 0 && (
                      <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>
                        ({Math.abs(ranking.kgLoss).toFixed(1)}kg)
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {ranking.waApplied && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: '#fdf2e9',
                borderRadius: '8px',
                border: '1px solid #f5b041',
                fontSize: '0.9em',
                color: '#d35400'
              }}>
                Anti-dehydration applied
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default Leaderboard;