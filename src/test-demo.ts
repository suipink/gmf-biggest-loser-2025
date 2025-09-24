import { computeRankings, CompetitorEntry } from './utils/logic';
import { rankToBadge, formatPercentage } from './utils/format';

const testEntries: CompetitorEntry[] = [
  { name: "Alice", baselineWeight: 100, currentWeight: 92 },
  { name: "Bob", baselineWeight: 120, currentWeight: 108 },
  { name: "Charlie", baselineWeight: 90, currentWeight: 83 },
  { name: "Diana", baselineWeight: 110, currentWeight: 99 },
  { name: "Eve", baselineWeight: 95, currentWeight: 87.05 },
  { name: "Frank", baselineWeight: 105, currentWeight: 96.55 },
  { name: "Grace", baselineWeight: 85, currentWeight: 78.03 }
];

console.log("=== GMF Biggest Loser 2025 - Rank Badge Testing ===\n");

const rankings = computeRankings(testEntries, "preFinal");

console.log("Rankings with Badges:\n");
rankings.forEach((ranking, index) => {
  const badge = rankToBadge(ranking.rank);
  const tiedText = ranking.isTied ? " (Tied)" : "";

  console.log(`${badge.emoji} #${ranking.rank} - ${ranking.name}`);
  console.log(`   Progress: ${formatPercentage(ranking.percentLoss)}${tiedText}`);
  console.log(`   Badge: ${badge.emoji} ${badge.label}\n`);
});

console.log("\n=== Testing Edge Cases ===\n");

const tieTestEntries: CompetitorEntry[] = [
  { name: "Tied-1", baselineWeight: 100, currentWeight: 92 },
  { name: "Tied-2", baselineWeight: 150, currentWeight: 138 },
  { name: "Winner", baselineWeight: 100, currentWeight: 90 },
  { name: "Fourth", baselineWeight: 100, currentWeight: 93 }
];

const tieRankings = computeRankings(tieTestEntries, "preFinal");

console.log("Tie Test Results:\n");
tieRankings.forEach(ranking => {
  const badge = rankToBadge(ranking.rank);
  const tiedText = ranking.isTied ? " (Tied)" : "";

  console.log(`${badge.emoji} #${ranking.rank} - ${ranking.name} - ${formatPercentage(ranking.percentLoss)}${tiedText}`);
});

console.log("\n=== Badge System Test ===\n");
for (let i = 1; i <= 15; i++) {
  const badge = rankToBadge(i);
  console.log(`Rank ${i}: ${badge.emoji} ${badge.label}`);
}