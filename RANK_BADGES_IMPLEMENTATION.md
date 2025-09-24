# GMF Biggest Loser 2025 - Rank Badges Implementation Guide

## 📋 Requirements Overview

### Core Features
- **Rank badges/emojis** displayed on each competitor card/row
- Badges computed from **% Loss vs baseline** (higher % = better rank)
- **Live updates** as data changes
- Support for **ties** (within 0.01% difference)
- **Hidden weights policy** respect (no kg values pre-reveal)

### Badge System
| Rank | Badge | Description |
|------|-------|-------------|
| 1st | 🥇 | Gold medal |
| 2nd | 🥈 | Silver medal |
| 3rd | 🥉 | Bronze medal |
| 4th-10th | 🏅 | Medal with rank number |
| 11th+ | 🎖 | Military medal with rank number |

### Tie Handling
- Competitors with same % Loss (±0.01) share same rank and badge
- Next rank uses competition ranking (1, 1, 3...)
- Show "Tied" label for tied competitors

## ✅ Implementation Progress

### ✅ Core Logic (src/utils/logic.ts)
- [x] `CompetitorEntry` interface defined
- [x] `RankingResult` interface with rank, isTied fields
- [x] `computeRankings(entries, mode)` function implemented
  - [x] Supports "preFinal" and "final" modes
  - [x] Anti-dehydration rule placeholder for final mode
  - [x] Proper tie detection (±0.01% threshold)
  - [x] Competition ranking system (1,1,3...)
  - [x] Sorts by percentLoss descending

### ✅ Badge Formatting (src/utils/format.ts)
- [x] `BadgeInfo` interface for emoji + label
- [x] `rankToBadge(rank)` function implemented
  - [x] Maps rank 1-3 to medal emojis
  - [x] Maps rank 4-10 to 🏅 + ordinal
  - [x] Maps rank 11+ to 🎖 + ordinal
- [x] `getOrdinalSuffix()` helper for proper ordinals
- [x] `formatPercentage()` helper for consistent % display

### ✅ React Components (src/components/)
- [x] `Leaderboard.tsx` component implemented
  - [x] Badge display in top-left of cards
  - [x] "Tied" label for tied competitors
  - [x] Accessibility aria-labels with proper descriptions
  - [x] Responsive design for mobile/desktop
  - [x] Styled-jsx for component styling
  - [x] Card-based layout with hover effects

### ✅ Testing & Validation
- [x] Test demo created (`src/test-demo.ts`)
- [x] Tie scenarios tested (identical % loss handling)
- [x] Edge cases validated (competition ranking 1,1,3...)
- [x] Visual demo HTML created (`demo.html`)
- [x] Badge system showcase with all rank types

## 📐 Technical Specifications

### Tie Detection Logic
```typescript
const isTied = Math.abs(entry.percentLoss - prevEntry.percentLoss) < 0.01;
```

### Ranking Algorithm
1. Sort competitors by percentLoss (descending)
2. Assign ranks using competition system
3. Mark ties where difference < 0.01%
4. Update all tied entries with same rank

### Accessibility Requirements
```typescript
aria-label={`Rank: ${badgeInfo.label} (${badgeInfo.emoji}). Percent loss: ${formatPercentage(percentLoss)}`}
```

### Hidden Weights Policy
- **Pre-reveal**: Show badges and % Loss only
- **Final mode**: Apply anti-dehydration rule before ranking
- **Pre-final mode**: Use latest weigh-in data

## 🎯 Implementation Complete ✅

### Files Created:
- `src/utils/logic.ts` - Core ranking computation with tie handling
- `src/utils/format.ts` - Badge formatting and utility functions
- `src/components/Leaderboard.tsx` - React component with full UI
- `src/test-demo.ts` - Console-based testing script
- `demo.html` - Visual demonstration of the badge system

### Ready for Integration:
1. ✅ **Core logic implemented** - Rankings with proper tie handling
2. ✅ **Badge system complete** - All emoji mappings and overlays
3. ✅ **React component ready** - Responsive cards with accessibility
4. ✅ **Testing validated** - Edge cases and tie scenarios covered
5. ✅ **Demo available** - Visual showcase of functionality

### Next Steps for Integration:
- Import `computeRankings` into existing app logic
- Replace current leaderboard component with new `Leaderboard.tsx`
- Connect live data updates to trigger re-ranking
- Customize styling to match app theme

## 📝 Notes
- Badge positions: top-left of competitor cards
- Rank overlay text: "#4", "#5" etc. for ranks 4+
- Competition ranking ensures no gaps except after ties
- Anti-dehydration rule implementation pending