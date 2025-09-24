import React from 'react';
import { computeRankings, CompetitorEntry, RankingResult } from '../utils/logic';
import { rankToBadge, formatPercentage } from '../utils/format';

interface LeaderboardProps {
  entries: CompetitorEntry[];
  mode: "preFinal" | "final";
  showWeights?: boolean;
}

interface RankBadgeProps {
  ranking: RankingResult;
}

const RankBadge: React.FC<RankBadgeProps> = ({ ranking }) => {
  const badgeInfo = rankToBadge(ranking.rank);

  return (
    <div className="rank-badge">
      <span className="rank-emoji">{badgeInfo.emoji}</span>
      {ranking.rank > 3 && (
        <span className="rank-number">#{ranking.rank}</span>
      )}
      {ranking.isTied && (
        <span className="tied-indicator">Tied</span>
      )}
    </div>
  );
};

interface CompetitorCardProps {
  ranking: RankingResult;
  showWeights: boolean;
}

const CompetitorCard: React.FC<CompetitorCardProps> = ({ ranking, showWeights }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);

  return (
    <div className="competitor-card">
      <div className="card-content">
        <div className="card-header">
          <div className="profile-section">
            {!imageError ? (
              <img
                src={ranking.profilePic}
                alt={`${ranking.name} profile`}
                className={`profile-pic ${imageLoading ? 'loading' : ''}`}
                onError={() => setImageError(true)}
                onLoad={() => setImageLoading(false)}
              />
            ) : (
              <div className="profile-pic loading">
                {ranking.name.split(' ').map(name => name[0]).join('')}
              </div>
            )}
            <RankBadge ranking={ranking} />
          </div>
          <div className="name-section">
            <h3 className="competitor-name">{ranking.name}</h3>
            <div className="cheerer-name">กองเชียร์: {ranking.cheerer}</div>
            <div className="progress-section">
              <div className={`percent-loss ${ranking.percentLoss > 0 ? 'losing' : 'gaining'}`}>
                {ranking.percentLoss > 0 ? '↓' : '↑'} {formatPercentage(ranking.percentLoss)}
              </div>
            </div>
          </div>
        </div>

        {ranking.waApplied && (
          <div className="wa-indicator">
            <span className="label">Anti-dehydration applied</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  mode,
  showWeights = false
}) => {
  const rankings = computeRankings(entries, mode);

  return (
    <div className="leaderboard">
      <div className="leaderboard-grid">
        {rankings.map((ranking) => (
          <CompetitorCard
            key={ranking.name}
            ranking={ranking}
            showWeights={showWeights}
          />
        ))}
      </div>

      <style>{`
        .leaderboard {
          width: 100%;
        }

        .leaderboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 20px;
        }

        .competitor-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 2px solid #f0f0f0;
          transition: all 0.3s ease;
          position: relative;
          min-height: 280px;
        }

        .competitor-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transform: translateY(-4px);
        }

        .card-content {
          padding: 32px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .profile-section {
          position: relative;
          flex-shrink: 0;
        }

        .rank-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .rank-emoji {
          font-size: 2.5em;
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));
        }

        .rank-number {
          font-size: 0.8em;
          color: #e67e22;
          font-weight: 900;
          text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
          margin-top: -8px;
          background: rgba(255,255,255,0.9);
          padding: 2px 6px;
          border-radius: 10px;
          border: 1px solid #e67e22;
        }

        .tied-indicator {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.7em;
          color: #2c3e50;
          font-weight: 600;
          background: #f39c12;
          padding: 4px 8px;
          border-radius: 12px;
          border: 2px solid #e67e22;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          z-index: 11;
        }

        .profile-pic {
          width: 180px;
          height: 220px;
          border-radius: 16px;
          object-fit: cover;
          border: 4px solid #f8f9fa;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          background-color: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 1.2em;
          font-weight: 500;
        }

        .profile-pic.loading {
          background-color: #f0f0f0;
          border: 4px solid #e0e0e0;
        }

        .name-section {
          flex: 1;
          min-width: 0;
        }

        .competitor-name {
          margin: 0 0 2px 0;
          font-size: 1.3em;
          color: #333;
          font-weight: 600;
        }

        .cheerer-name {
          margin: 0 0 6px 0;
          font-size: 0.9em;
          color: #666;
          font-weight: 500;
          font-family: 'Kanit', sans-serif;
        }

        .progress-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .percent-loss {
          font-size: 1.3em;
          font-weight: bold;
          margin: 0;
        }

        .percent-loss.losing {
          color: #27ae60;
        }

        .percent-loss.gaining {
          color: #e74c3c;
        }

        .weight-change {
          font-size: 0.9em;
          font-weight: 600;
        }

        .weight-change.down {
          color: #27ae60;
        }

        .weight-change.up {
          color: #e74c3c;
        }

        .wa-indicator {
          margin-top: 16px;
          padding: 8px 12px;
          background: #fdf2e9;
          border-radius: 8px;
          border-left: 4px solid #e67e22;
        }

        .wa-indicator .label {
          font-size: 0.9em;
          color: #d35400;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .leaderboard-grid {
            grid-template-columns: 1fr;
          }

          .card-content {
            padding: 24px;
            padding-top: 35px;
          }

          .card-header {
            gap: 12px;
          }

          .profile-pic {
            width: 100px;
            height: 100px;
          }

          .competitor-name {
            font-size: 1.2em;
          }

          .profile-pic {
            width: 140px;
            height: 180px;
          }

          .rank-emoji {
            font-size: 2em;
          }

          .rank-number {
            font-size: 0.7em;
          }

          .progress-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }

          .percent-loss {
            font-size: 1.2em;
          }

          .weight-change {
            font-size: 0.8em;
          }
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;