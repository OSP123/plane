import React from "react";
import { observer } from "mobx-react";
import { Crown, Trophy, Star, Shield, Zap, Medal, Award, Target } from "lucide-react";
import { RANK_COLORS, RANK_ICONS, TGamificationRank } from "@plane/types";

interface IUserRankBadge {
  rank: TGamificationRank;
  score: number;
  size?: "sm" | "md" | "lg";
  showScore?: boolean;
  className?: string;
}

const RANK_ICONS_COMPONENTS: Record<TGamificationRank, React.ComponentType<{ className?: string }>> = {
  "Initiate": Target,
  "Guardsman": Shield,
  "Veteran": Zap,
  "Sergeant": Medal,
  "Lieutenant": Star,
  "Captain": Crown,
  "Colonel": Trophy,
  "General": Award,
};

export const UserRankBadge: React.FC<IUserRankBadge> = observer(({
  rank,
  score,
  size = "md",
  showScore = false,
  className = "",
}) => {
  const IconComponent = RANK_ICONS_COMPONENTS[rank];
  const rankColor = RANK_COLORS[rank];
  const rankEmoji = RANK_ICONS[rank];

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border-2 font-medium ${sizeClasses[size]} ${className}`}
      style={{ borderColor: rankColor, backgroundColor: `${rankColor}15` }}
    >
      <div className="flex items-center gap-1">
        <div style={{ color: rankColor }}>
          <IconComponent className="h-4 w-4" />
        </div>
        <span style={{ color: rankColor }}>
          {rank}
        </span>
      </div>
      {showScore && (
        <span className="text-gray-600 dark:text-gray-400">
          {score} pts
        </span>
      )}
    </div>
  );
});
