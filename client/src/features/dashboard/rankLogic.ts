// client/src/features/dashboard/rankLogic.ts

export interface RankBenefits {
  retailProfit: string;
  sponsorBonus: string;
  directBonus: string;
  indirectBonus: string;
  maintenancePV: number;
  perks: string[];
}

/**
 * Calculates the personal PV required to unlock bonuses based on Star Level
 */
export const getMaintenanceRequirement = (starLevel: number): number => {
  if (starLevel >= 8) return 300;
  if (starLevel === 7) return 200;
  if (starLevel === 6 || starLevel === 5) return 100;
  if (starLevel >= 1) return 30;
  return 0; // Star 0 has no maintenance
};

/**
 * Returns all benefits, bonuses, and perks for a specific rank
 */
export const getRankBenefits = (starLevel: number): RankBenefits => {
  const baseSponsor = "$5.00 each";
  const standardRetail = "20%";

  const benefitsMap: Record<number, Partial<RankBenefits>> = {
    0: {
      directBonus: "0%",
      indirectBonus: "0%",
      perks: ["Grass International Kit (T-shirt, Booklet, VIP Card)", "Product & Marketing Training"]
    },
    1: {
      directBonus: "10%",
      indirectBonus: "0-10%",
      perks: ["Business Starter status"]
    },
    2: {
      directBonus: "15%",
      indirectBonus: "0-15%",
      perks: []
    },
    3: {
      directBonus: "19%",
      indirectBonus: "0-19%",
      perks: []
    },
    4: {
      directBonus: "23%",
      indirectBonus: "0-23%",
      perks: []
    },
    5: {
      directBonus: "27%",
      indirectBonus: "0-27%",
      perks: [
        "1% Leadership Bonus",
        "$2,000 Cash (if reached in 3 months)",
        "$1,000 Cash (if reached in 4-6 months)",
        "$500 Cash (if reached in 7-12 months)"
      ]
    },
    6: {
      directBonus: "31%",
      indirectBonus: "0-31%",
      perks: ["1% Leadership Bonus", "1% Travel Fund"]
    },
    7: {
      directBonus: "35%",
      indirectBonus: "0-35%",
      perks: ["1% Leadership Bonus", "1% Travel Fund", "2% Car Fund"]
    },
    8: {
      directBonus: "39%",
      indirectBonus: "0-39%",
      perks: ["1% Leadership Bonus", "2% Car Fund", "2% Villa Fund", "2% Team Building Bonus"]
    },
    9: {
      directBonus: "43%",
      indirectBonus: "0-43%",
      perks: [
        "1% Leadership Bonus", 
        "1% Travel Fund", 
        "2% Car Fund", 
        "2% Villa Fund", 
        "2% Team Building Bonus",
        "$30,000 Cash Award",
        "Right to open New Branch (3% Share)"
      ]
    }
  };

  const rankData = benefitsMap[starLevel] || benefitsMap[0];

  return {
    retailProfit: starLevel >= 8 ? "10-20%" : standardRetail,
    sponsorBonus: baseSponsor,
    directBonus: rankData.directBonus || "0%",
    indirectBonus: rankData.indirectBonus || "0%",
    maintenancePV: getMaintenanceRequirement(starLevel),
    perks: rankData.perks || []
  };
};

/**
 * Strategy Advisor: Returns specific advice based on current progress
 */
export const getStrategicAdvice = (user: any) => {
  if (user.currentStar === 3) {
    // Logic for Star 4
    const threeStarLegs = user.downlines.filter((d: any) => d.rank >= 3).length;
    if (threeStarLegs < 2) return "Focus on your team: You need 2 different legs to reach Star 3 to unlock your Star 4 rank.";
    if (user.groupPV < 3800) return `Volume target: You need ${3800 - user.groupPV} more Group PV to qualify for Star 4.`;
  }
  
  if (user.currentStar === 4) {
    // Logic for Star 5
    const fourStarLegs = user.downlines.filter((d: any) => d.rank >= 4).length;
    if (fourStarLegs < 3) return "Leadership call: Help 3 members in different legs reach Star 4 to unlock your Star 5 status.";
    if (user.groupPV < 16000) return `Volume target: You need ${16000 - user.groupPV} more Group PV for Star 5.`;
  }

  return "Keep supporting your active legs to ensure steady rank advancement.";
};