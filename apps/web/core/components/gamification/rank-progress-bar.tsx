import React from "react";
import { observer } from "mobx-react";
import { RANK_COLORS, TGamificationRank } from "@plane/types";

interface IRankProgressBar {
  currentRank: TGamificationRank;
  progressPercentage: number;
  pointsInCurrentRank: number;
  maxPointsInCurrentRank: number;
  pointsToNextRank: number;
  nextRank: TGamificationRank | null;
  isMaxRank: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RankProgressBar: React.FC<IRankProgressBar> = observer(({
  currentRank,
  progressPercentage,
  pointsInCurrentRank,
  maxPointsInCurrentRank,
  pointsToNextRank,
  nextRank,
  isMaxRank,
  size = "md",
  className = "",
}) => {
  const rankColor = RANK_COLORS[currentRank];

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  if (isMaxRank) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span className="font-medium">Maximum Rank Achieved!</span>
          <span className="text-yellow-600 dark:text-yellow-400 font-bold">🏆 GENERAL</span>
        </div>
        <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]}`}>
          <div
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600`}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
        <span>
          {pointsInCurrentRank} / {maxPointsInCurrentRank} points in {currentRank}
        </span>
        <span>
          {pointsToNextRank} points to {nextRank}
        </span>
      </div>
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{
            width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
            backgroundColor: rankColor,
          }}
        />
      </div>
    </div>
  );
});
