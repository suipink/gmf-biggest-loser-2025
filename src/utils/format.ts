export interface BadgeInfo {
  emoji: string;
  label: string;
}

export function rankToBadge(rank: number): BadgeInfo {
  switch (rank) {
    case 1:
      return { emoji: "1️⃣", label: "1st" };
    case 2:
      return { emoji: "2️⃣", label: "2nd" };
    case 3:
      return { emoji: "3️⃣", label: "3rd" };
    case 4:
      return { emoji: "4️⃣", label: "4th" };
    case 5:
      return { emoji: "5️⃣", label: "5th" };
    case 6:
      return { emoji: "6️⃣", label: "6th" };
    case 7:
      return { emoji: "7️⃣", label: "7th" };
    case 8:
      return { emoji: "8️⃣", label: "8th" };
    case 9:
      return { emoji: "9️⃣", label: "9th" };
    case 10:
      return { emoji: "🔟", label: "10th" };
    default:
      return { emoji: `${rank}`, label: `${rank}${getOrdinalSuffix(rank)}` };
  }
}


function getOrdinalSuffix(num: number): string {
  if (num >= 11 && num <= 13) return "th";

  switch (num % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}