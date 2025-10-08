// mobx
import { action, computed, makeObservable, observable, runInAction } from "mobx";
// services
import { GamificationService } from "@/services/gamification.service";
// types
import { IUserGamification, ILeaderboardResponse, ILeaderboardEntry } from "@plane/types";

export interface IGamificationStore {
  // observables
  userGamification: IUserGamification | null;
  projectLeaderboard: ILeaderboardEntry[];
  workspaceLeaderboard: ILeaderboardEntry[];
  isLoading: boolean;
  error: string | null;

  // actions
  fetchUserGamification: (workspaceSlug: string, projectId?: string) => Promise<void>;
  fetchProjectLeaderboard: (workspaceSlug: string, projectId: string, limit?: number) => Promise<void>;
  fetchWorkspaceLeaderboard: (workspaceSlug: string, limit?: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;

  // computed
  currentRank: string | null;
  currentScore: number;
  progressPercentage: number;
  pointsToNextRank: number;
  isMaxRank: boolean;
}

export class GamificationStore implements IGamificationStore {
  // observables
  userGamification: IUserGamification | null = null;
  projectLeaderboard: ILeaderboardEntry[] = [];
  workspaceLeaderboard: ILeaderboardEntry[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  // services
  gamificationService: GamificationService;

  constructor() {
    makeObservable(this, {
      // observables
      userGamification: observable,
      projectLeaderboard: observable,
      workspaceLeaderboard: observable,
      isLoading: observable,
      error: observable,

      // actions
      fetchUserGamification: action,
      fetchProjectLeaderboard: action,
      fetchWorkspaceLeaderboard: action,
      clearError: action,
      reset: action,

      // computed
      currentRank: computed,
      currentScore: computed,
      progressPercentage: computed,
      pointsToNextRank: computed,
      isMaxRank: computed,
    });

    this.gamificationService = new GamificationService();
  }

  // actions
  fetchUserGamification = async (workspaceSlug: string, projectId?: string) => {
    try {
      this.isLoading = true;
      this.error = null;

      const response = await this.gamificationService.getUserGamification(workspaceSlug, projectId);

      runInAction(() => {
        this.userGamification = response;
        this.isLoading = false;
      });
    } catch (error) {
      console.error("Failed to fetch user gamification data:", error);
      runInAction(() => {
        this.error = "Failed to fetch gamification data";
        this.isLoading = false;
      });
    }
  };

  fetchProjectLeaderboard = async (workspaceSlug: string, projectId: string, limit: number = 10) => {
    try {
      this.isLoading = true;
      this.error = null;

      const response: ILeaderboardResponse = await this.gamificationService.getProjectLeaderboard(
        workspaceSlug,
        projectId,
        limit
      );

      runInAction(() => {
        this.projectLeaderboard = response.leaderboard;
        this.isLoading = false;
      });
    } catch (error) {
      console.error("Failed to fetch project leaderboard:", error);
      runInAction(() => {
        this.error = "Failed to fetch project leaderboard";
        this.isLoading = false;
      });
    }
  };

  fetchWorkspaceLeaderboard = async (workspaceSlug: string, limit: number = 10) => {
    try {
      this.isLoading = true;
      this.error = null;

      const response: ILeaderboardResponse = await this.gamificationService.getWorkspaceLeaderboard(
        workspaceSlug,
        limit
      );

      runInAction(() => {
        this.workspaceLeaderboard = response.leaderboard;
        this.isLoading = false;
      });
    } catch (error) {
      console.error("Failed to fetch workspace leaderboard:", error);
      runInAction(() => {
        this.error = "Failed to fetch workspace leaderboard";
        this.isLoading = false;
      });
    }
  };

  clearError = () => {
    this.error = null;
  };

  reset = () => {
    this.userGamification = null;
    this.projectLeaderboard = [];
    this.workspaceLeaderboard = [];
    this.isLoading = false;
    this.error = null;
  };

  // computed
  get currentRank(): string | null {
    return this.userGamification?.rank || null;
  }

  get currentScore(): number {
    return this.userGamification?.score || 0;
  }

  get progressPercentage(): number {
    return this.userGamification?.progress_info.progress_percentage || 0;
  }

  get pointsToNextRank(): number {
    return this.userGamification?.progress_info.points_to_next_rank || 0;
  }

  get isMaxRank(): boolean {
    return this.userGamification?.progress_info.is_max_rank || false;
  }
}
