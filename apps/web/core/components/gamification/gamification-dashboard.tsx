import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Crown, TrendingUp, Target, Users } from "lucide-react";
import { GamificationStore } from "@/store/gamification/gamification.store";
import { UserRankBadge } from "./user-rank-badge";
import { RankProgressBar } from "./rank-progress-bar";
import { Leaderboard } from "./leaderboard";

interface IGamificationDashboard {
  workspaceSlug: string;
  projectId: string;
  gamificationStore: GamificationStore;
  className?: string;
}

export const GamificationDashboard: React.FC<IGamificationDashboard> = observer(({
  workspaceSlug,
  projectId,
  gamificationStore,
  className = "",
}) => {
  useEffect(() => {
    // Fetch gamification data when component mounts
    gamificationStore.fetchUserGamification(workspaceSlug, projectId);
    gamificationStore.fetchProjectLeaderboard(workspaceSlug, projectId, 5);
  }, [workspaceSlug, projectId, gamificationStore]);

  if (gamificationStore.isLoading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (gamificationStore.error) {
    return (
      <div className={`${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{gamificationStore.error}</p>
          <button
            onClick={() => gamificationStore.clearError()}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  const userGamification = gamificationStore.userGamification;
  if (!userGamification) {
    return (
      <div className={`${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No gamification data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* User Stats Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Your Imperial Guard Status
          </h2>
          <UserRankBadge 
            rank={userGamification.rank} 
            score={userGamification.score}
            size="lg"
            showScore={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {userGamification.tasks_completed}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {userGamification.score}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Crown className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {userGamification.rank}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Rank</p>
          </div>
        </div>

        {/* Progress Bar */}
        <RankProgressBar
          currentRank={userGamification.rank}
          progressPercentage={userGamification.progress_info.progress_percentage}
          pointsInCurrentRank={userGamification.progress_info.points_in_current_rank}
          maxPointsInCurrentRank={userGamification.progress_info.max_points_in_current_rank}
          pointsToNextRank={userGamification.progress_info.points_to_next_rank}
          nextRank={userGamification.progress_info.next_rank}
          isMaxRank={userGamification.progress_info.is_max_rank}
          size="lg"
        />

        {userGamification.progress_info.next_rank && !userGamification.progress_info.is_max_rank && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Next Rank:</strong> {userGamification.progress_info.next_rank} - {userGamification.progress_info.next_rank_description}
            </p>
          </div>
        )}
      </div>

      {/* Project Leaderboard */}
      <Leaderboard
        leaderboard={gamificationStore.projectLeaderboard}
        title="Project Leaderboard"
      />
    </div>
  );
});
