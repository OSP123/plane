// services
import { API_BASE_URL } from "@plane/constants";
import { IUserGamification, ILeaderboardResponse } from "@plane/types";
import { APIService } from "@/services/api.service";

export class GamificationService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async getUserGamification(workspaceSlug: string, projectId?: string): Promise<IUserGamification> {
    const endpoint = projectId 
      ? `/api/workspaces/${workspaceSlug}/projects/${projectId}/gamification/`
      : `/api/workspaces/${workspaceSlug}/gamification/me/`;
    
    return this.get(endpoint)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getProjectLeaderboard(workspaceSlug: string, projectId: string, limit: number = 10): Promise<ILeaderboardResponse> {
    return this.get(`/api/workspaces/${workspaceSlug}/projects/${projectId}/gamification/leaderboard/`, { limit })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getWorkspaceLeaderboard(workspaceSlug: string, limit: number = 10): Promise<ILeaderboardResponse> {
    return this.get(`/api/workspaces/${workspaceSlug}/gamification/leaderboard/`, { limit })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
