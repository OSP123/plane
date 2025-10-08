// Gamification types for Warhammer 40k themed task completion system

export type TGamificationRank = 
  | "Initiate"
  | "Guardsman" 
  | "Veteran"
  | "Sergeant"
  | "Lieutenant"
  | "Captain"
  | "Colonel"
  | "General";

export interface IGamificationRankData {
  min_score: number;
  max_score: number;
  description: string;
}

export interface IGamificationProgress {
  current_rank: TGamificationRank;
  current_rank_description: string;
  score: number;
  progress_percentage: number;
  points_in_current_rank: number;
  max_points_in_current_rank: number;
  next_rank: TGamificationRank | null;
  next_rank_description: string | null;
  points_to_next_rank: number;
  is_max_rank: boolean;
}

export interface IUserGamification {
  score: number;
  rank: TGamificationRank;
  tasks_completed: number;
  last_rank_upgrade: string | null;
  progress_info: IGamificationProgress;
}

export interface ILeaderboardEntry {
  user_id: string;
  display_name: string;
  username: string;
  score: number;
  tasks_completed: number;
  rank: TGamificationRank;
  rank_description: string;
  last_rank_upgrade: string | null;
}

export interface ILeaderboardResponse {
  leaderboard: ILeaderboardEntry[];
  workspace_id?: string;
  project_id?: string;
}

// Rank display configuration
export const GAMIFICATION_RANKS: Record<TGamificationRank, IGamificationRankData> = {
  "Initiate": { min_score: 0, max_score: 9, description: "Fresh recruit to the Imperial Guard" },
  "Guardsman": { min_score: 10, max_score: 49, description: "Basic soldier in the Imperial Guard" },
  "Veteran": { min_score: 50, max_score: 99, description: "Experienced fighter with battle scars" },
  "Sergeant": { min_score: 100, max_score: 199, description: "Squad leader commanding fellow soldiers" },
  "Lieutenant": { min_score: 200, max_score: 399, description: "Junior officer with command responsibility" },
  "Captain": { min_score: 400, max_score: 699, description: "Company commander leading hundreds" },
  "Colonel": { min_score: 700, max_score: 999, description: "Regiment commander with vast experience" },
  "General": { min_score: 1000, max_score: Infinity, description: "High command with legendary status" },
};

// Rank colors for UI display
export const RANK_COLORS: Record<TGamificationRank, string> = {
  "Initiate": "#9CA3AF", // Gray
  "Guardsman": "#3B82F6", // Blue
  "Veteran": "#8B5CF6", // Purple
  "Sergeant": "#10B981", // Green
  "Lieutenant": "#F59E0B", // Yellow
  "Captain": "#EF4444", // Red
  "Colonel": "#DC2626", // Dark Red
  "General": "#7C2D12", // Dark Brown/Gold
};

// Rank icons (using simple text representations)
export const RANK_ICONS: Record<TGamificationRank, string> = {
  "Initiate": "⚔️",
  "Guardsman": "🛡️",
  "Veteran": "⚡",
  "Sergeant": "🎖️",
  "Lieutenant": "⭐",
  "Captain": "👑",
  "Colonel": "🏆",
  "General": "👑",
};
