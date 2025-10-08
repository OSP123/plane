import React from "react";
import { observer } from "mobx-react";
import { Trophy, Medal, Award, User } from "lucide-react";
import { ILeaderboardEntry, RANK_COLORS, RANK_ICONS } from "@plane/types";
import { UserRankBadge } from "./user-rank-badge";

interface ILeaderboard {
  leaderboard: ILeaderboardEntry[];
  title?: string;
  className?: string;
}

export const Leaderboard: React.FC<ILeaderboard> = observer(({
  leaderboard,
  title = "Leaderboard",
  className = "",
}) => {
  const getRankIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (position === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (position === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <User className="h-4 w-4 text-gray-500" />;
  };

  const getRankBackground = (position: number) => {
    if (position === 1) return "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20";
    if (position === 2) return "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20";
    if (position === 3) return "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20";
    return "bg-gray-50 dark:bg-gray-800/20";
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {leaderboard.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No data available yet</p>
            <p className="text-sm">Complete some tasks to see the leaderboard!</p>
          </div>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.user_id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${getRankBackground(index + 1)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index + 1)}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {entry.display_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {entry.display_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{entry.username}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <UserRankBadge 
                    rank={entry.rank} 
                    score={entry.score} 
                    size="sm"
                    showScore={true}
                  />
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {entry.tasks_completed} tasks
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.score} points
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
