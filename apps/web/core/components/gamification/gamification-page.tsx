import React from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { GamificationDashboard } from "./gamification-dashboard";

interface IGamificationPage {
  gamificationStore: any; // Replace with proper type from store
}

export const GamificationPage: React.FC<IGamificationPage> = observer(({
  gamificationStore,
}) => {
  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  if (!workspaceSlug || !projectId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🎖️ Imperial Guard Gamification
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete tasks to earn points and climb the ranks of the Imperial Guard!
        </p>
      </div>
      
      <GamificationDashboard
        workspaceSlug={workspaceSlug as string}
        projectId={projectId as string}
        gamificationStore={gamificationStore}
      />
    </div>
  );
});
