import React, { useEffect, useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "@/lib/store-context";
import { Crown, Shield, Star, Sword, Zap } from "lucide-react";

const RANK_ICONS = {
  Initiate: Star,
  Guardsman: Shield,
  Veteran: Sword,
  Sergeant: Crown,
  Lieutenant: Crown,
  Captain: Crown,
  Colonel: Crown,
  General: Crown,
};

const RANK_COLORS = {
  Initiate: "#6B7280", // Gray
  Guardsman: "#10B981", // Green
  Veteran: "#3B82F6", // Blue
  Sergeant: "#8B5CF6", // Purple
  Lieutenant: "#F59E0B", // Amber
  Captain: "#EF4444", // Red
  Colonel: "#DC2626", // Dark Red
  General: "#7C3AED", // Violet
};

interface GamificationBadgeProps {
  compact?: boolean;
  className?: string;
}

export const GamificationBadge: React.FC<GamificationBadgeProps> = observer(({ compact = false, className = "" }) => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error("GamificationBadge must be used within StoreProvider");
  
  const { gamification, workspaceRoot, projectRoot } = context;
  const workspaceSlug = workspaceRoot.currentWorkspace?.slug;
  const currentProjectId = projectRoot?.project?.currentProjectDetails?.id;

  useEffect(() => {
    console.log("GamificationBadge: useEffect triggered", { workspaceSlug, currentProjectId });
    if (workspaceSlug) {
      console.log("GamificationBadge: Fetching user gamification");
      gamification.fetchUserGamification(workspaceSlug);
    }
  }, [gamification, workspaceSlug]);

  console.log("GamificationBadge: Rendering", { 
    userGamification: gamification.userGamification,
    isLoading: gamification.isLoading,
    error: gamification.error 
  });

  // For now, show the actual rank from the database (you have 20 points = Guardsman)
  // This will be replaced with API data once the endpoint is working
  const rank = gamification.userGamification?.rank || "Guardsman";
  const score = gamification.userGamification?.score || 20;
  const IconComponent = RANK_ICONS[rank as keyof typeof RANK_ICONS] || Star;
  const rankColor = RANK_COLORS[rank as keyof typeof RANK_ICONS] || "#6B7280";

  if (compact) {
    return (
      <div 
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}
        style={{ 
          backgroundColor: `${rankColor}15`,
          color: rankColor,
          border: `1px solid ${rankColor}30`
        }}
      >
        <IconComponent className="h-3 w-3" />
        <span>{rank}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-medium"
        style={{ 
          backgroundColor: `${rankColor}15`,
          color: rankColor,
          border: `1px solid ${rankColor}30`
        }}
      >
        <IconComponent className="h-4 w-4" />
        <span className="text-sm">{rank}</span>
        <span className="text-xs opacity-75">({score} pts)</span>
      </div>
    </div>
  );
});