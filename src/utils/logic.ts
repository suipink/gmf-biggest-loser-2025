export interface WeighIn {
  date: string;
  weight: number;
}

export interface CompetitorEntry {
  name: string;
  baselineWeight: number;
  currentWeight: number;
  profilePic: string;
  beforePhoto?: string;
  afterPhoto?: string;
  cheerer: string;
  weighIns: WeighIn[];
  percentLoss?: number;
  waApplied?: boolean;
}

export interface RankingResult {
  name: string;
  percentLoss: number;
  kgLoss: number;
  rank: number;
  isTied: boolean;
  profilePic: string;
  beforePhoto?: string;
  afterPhoto?: string;
  cheerer: string;
  weighIns: WeighIn[];
  weightChangePercent?: number;
  weightTrend?: 'up' | 'down' | 'same';
  waApplied?: boolean;
  hasInsufficientData?: boolean;
}

export function computeRankings(entries: CompetitorEntry[], mode: "preFinal" | "final"): RankingResult[] {
  const processedEntries = entries.map(entry => {
    // Check if we have enough data points for meaningful calculation
    const hasInsufficientData = entry.weighIns.length <= 1;

    let currentWeight = entry.currentWeight;
    let baselineWeight = entry.baselineWeight;
    let percentLoss = 0;
    let kgLoss = 0;

    if (!hasInsufficientData) {
      // Sort weigh-ins by date to get first and latest
      const sortedWeighIns = [...entry.weighIns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Use first weigh-in as baseline and latest weigh-in as current
      baselineWeight = sortedWeighIns[0].weight; // First weigh-in
      currentWeight = sortedWeighIns[sortedWeighIns.length - 1].weight; // Latest weigh-in

      // Calculate percentage and kg loss (latest vs first)
      percentLoss = ((baselineWeight - currentWeight) / baselineWeight) * 100;
      kgLoss = baselineWeight - currentWeight;

      // Debug log for calculation verification
      console.log(`${entry.name}: Baseline=${baselineWeight}kg, Current=${currentWeight}kg, Loss=${percentLoss.toFixed(2)}%, ${kgLoss.toFixed(1)}kg`);
    }

    let waApplied = entry.waApplied || false;

    if (mode === "final") {
      currentWeight = applyAntiDehydrationRule(entry);
      waApplied = currentWeight !== entry.currentWeight;
    }

    // Calculate weight trend comparing latest vs first weigh-in
    let weightChangePercent = 0;
    let weightTrend: 'up' | 'down' | 'same' = 'same';

    if (entry.weighIns.length >= 1) {
      const sortedWeighIns = [...entry.weighIns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const firstWeight = sortedWeighIns[0].weight; // First weigh-in (baseline)
      const latestWeight = sortedWeighIns[sortedWeighIns.length - 1].weight; // Latest weigh-in

      const weightChange = latestWeight - firstWeight;
      weightChangePercent = Math.abs((weightChange / firstWeight) * 100);

      if (Math.abs(weightChange) < 0.1) {
        weightTrend = 'same';
      } else if (weightChange > 0) {
        weightTrend = 'up'; // Gained weight
      } else {
        weightTrend = 'down'; // Lost weight
      }
    }

    return {
      name: entry.name,
      percentLoss: hasInsufficientData ? -1 : percentLoss,
      kgLoss: hasInsufficientData ? -1 : kgLoss,
      profilePic: entry.profilePic,
      beforePhoto: entry.beforePhoto,
      afterPhoto: entry.afterPhoto,
      cheerer: entry.cheerer,
      weighIns: entry.weighIns,
      weightChangePercent,
      weightTrend,
      waApplied,
      hasInsufficientData
    };
  });

  // Sort by percent loss (highest first), put entries with insufficient data at the end
  processedEntries.sort((a, b) => {
    // If both have insufficient data, sort by name
    if (a.hasInsufficientData && b.hasInsufficientData) {
      return a.name.localeCompare(b.name);
    }
    // If only a has insufficient data, put it at the end
    if (a.hasInsufficientData) return 1;
    // If only b has insufficient data, put it at the end
    if (b.hasInsufficientData) return -1;
    // Both have sufficient data, sort by percentage loss (highest first)
    return b.percentLoss - a.percentLoss;
  });

  // Simple ranking: assign ranks 1, 2, 3, 4, 5, 6...
  // Handle ties by giving same rank and skipping next positions
  const results: RankingResult[] = [];

  for (let i = 0; i < processedEntries.length; i++) {
    const entry = processedEntries[i];
    let rank = i + 1;
    let isTied = false;

    // Entries with insufficient data don't get ranked
    if (entry.hasInsufficientData) {
      rank = -1; // Special value to indicate no ranking
    } else {
      // Check for ties with previous entry (only for entries with sufficient data)
      if (i > 0) {
        const prevEntry = processedEntries[i - 1];

        // Only check ties if both entries have sufficient data
        if (!prevEntry.hasInsufficientData) {
          const percentDiff = Math.abs(entry.percentLoss - prevEntry.percentLoss);

          if (percentDiff < 0.1) { // Less than 0.1% difference = tied
            rank = results[i - 1].rank; // Same rank as previous
            isTied = true;
            results[i - 1].isTied = true; // Mark previous as tied too
          }
        }
      }
    }

    results.push({
      ...entry,
      rank: rank,
      isTied: isTied
    });
  }

  // Debug: Log the ranking results
  console.log('🏆 Ranking Results:', results.map(r => ({ name: r.name, rank: r.rank, percentLoss: r.percentLoss.toFixed(2) + '%', isTied: r.isTied })));

  return results;
}

function applyAntiDehydrationRule(entry: CompetitorEntry): number {
  return entry.currentWeight;
}