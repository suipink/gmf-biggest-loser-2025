export interface WeighIn {
  date: string;
  weight: number;
}

export interface CompetitorEntry {
  name: string;
  baselineWeight: number;
  currentWeight: number;
  profilePic: string;
  cheerer: string;
  weighIns: WeighIn[];
  percentLoss?: number;
  waApplied?: boolean;
}

export interface RankingResult {
  name: string;
  percentLoss: number;
  rank: number;
  isTied: boolean;
  profilePic: string;
  cheerer: string;
  weighIns: WeighIn[];
  weightChangePercent?: number;
  weightTrend?: 'up' | 'down' | 'same';
  waApplied?: boolean;
}

export function computeRankings(entries: CompetitorEntry[], mode: "preFinal" | "final"): RankingResult[] {
  const processedEntries = entries.map(entry => {
    let currentWeight = entry.currentWeight;
    let waApplied = entry.waApplied || false;

    if (mode === "final") {
      currentWeight = applyAntiDehydrationRule(entry);
      waApplied = currentWeight !== entry.currentWeight;
    }

    const percentLoss = ((entry.baselineWeight - currentWeight) / entry.baselineWeight) * 100;

    // Calculate percentage change from previous weigh-in
    let weightChangePercent = 0;
    let weightTrend: 'up' | 'down' | 'same' = 'same';

    if (entry.weighIns.length >= 2) {
      const sortedWeighIns = [...entry.weighIns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const currentWeightFromData = sortedWeighIns[sortedWeighIns.length - 1].weight;
      const previousWeight = sortedWeighIns[sortedWeighIns.length - 2].weight;

      const weightChange = currentWeightFromData - previousWeight;
      weightChangePercent = (weightChange / previousWeight) * 100;

      if (Math.abs(weightChangePercent) < 0.1) {
        weightTrend = 'same';
      } else if (weightChangePercent > 0) {
        weightTrend = 'up';
      } else {
        weightTrend = 'down';
      }
    }

    return {
      name: entry.name,
      percentLoss: Math.max(0, percentLoss),
      profilePic: entry.profilePic,
      cheerer: entry.cheerer,
      weighIns: entry.weighIns,
      weightChangePercent,
      weightTrend,
      waApplied
    };
  });

  processedEntries.sort((a, b) => b.percentLoss - a.percentLoss);

  const results: RankingResult[] = [];
  let currentRank = 1;

  for (let i = 0; i < processedEntries.length; i++) {
    const entry = processedEntries[i];

    if (i === 0) {
      results.push({
        ...entry,
        rank: currentRank,
        isTied: false
      });
    } else {
      const prevEntry = processedEntries[i - 1];
      const isTied = Math.abs(entry.percentLoss - prevEntry.percentLoss) < 0.01;

      if (!isTied) {
        currentRank = i + 1;
      }

      results.push({
        ...entry,
        rank: results[i - 1].rank,
        isTied
      });
    }
  }

  for (let i = 1; i < results.length; i++) {
    const prevEntry = results[i - 1];
    const currentEntry = results[i];

    if (Math.abs(currentEntry.percentLoss - prevEntry.percentLoss) < 0.01) {
      currentEntry.isTied = true;
      prevEntry.isTied = true;
      currentEntry.rank = prevEntry.rank;
    }
  }

  return results;
}

function applyAntiDehydrationRule(entry: CompetitorEntry): number {
  return entry.currentWeight;
}