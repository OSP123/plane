# Python imports
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Module imports
from plane.app.views.base import BaseAPIView
from plane.app.permissions import ProjectEntityPermission
from plane.db.models import Profile, WorkspaceMember
from plane.utils.gamification import get_rank_progress


class UserGamificationAPIEndpoint(BaseAPIView):
    """User Gamification API Endpoint"""
    
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, slug, project_id=None):
        """Get current user's gamification data"""
        try:
            # Get user's profile
            user_profile = Profile.objects.get(user=request.user)
            
            # Get rank progress information
            progress_info = get_rank_progress(user_profile.gamification_score)
            
            return Response({
                "score": user_profile.gamification_score,
                "rank": user_profile.gamification_rank,
                "tasks_completed": user_profile.tasks_completed,
                "last_rank_upgrade": user_profile.last_rank_upgrade,
                "progress_info": progress_info,
            }, status=status.HTTP_200_OK)
            
        except Profile.DoesNotExist:
            return Response({
                "score": 0,
                "rank": "Initiate",
                "tasks_completed": 0,
                "last_rank_upgrade": None,
                "progress_info": {
                    "current_rank": "Initiate",
                    "current_rank_description": "Fresh recruit to the Imperial Guard",
                    "score": 0,
                    "progress_percentage": 0,
                    "points_in_current_rank": 0,
                    "max_points_in_current_rank": 9,
                    "next_rank": "Guardsman",
                    "next_rank_description": "Basic soldier in the Imperial Guard",
                    "points_to_next_rank": 10,
                    "is_max_rank": False,
                },
            }, status=status.HTTP_200_OK)


class WorkspaceLeaderboardAPIEndpoint(BaseAPIView):
    """Workspace Leaderboard API Endpoint"""
    
    permission_classes = [
        IsAuthenticated,
        ProjectEntityPermission,
    ]

    def get(self, request, slug):
        """Get workspace leaderboard data"""
        try:
            # Get workspace members and their gamification data
            from plane.db.models import Project
            workspace_members = WorkspaceMember.objects.filter(workspace__slug=slug).select_related('member__profile')
            
            leaderboard = []
            for member in workspace_members:
                if member.member.profile and member.member.profile.gamification_score > 0:
                    progress_info = get_rank_progress(member.member.profile.gamification_score)
                    leaderboard.append({
                        "user_id": member.member.id,
                        "display_name": member.member.display_name,
                        "username": member.member.username,
                        "score": member.member.profile.gamification_score,
                        "tasks_completed": member.member.profile.tasks_completed,
                        "rank": member.member.profile.gamification_rank,
                        "rank_description": progress_info["current_rank_description"],
                        "last_rank_upgrade": member.member.profile.last_rank_upgrade,
                    })
            
            # Sort by score and limit results
            leaderboard.sort(key=lambda x: x["score"], reverse=True)
            limit = int(request.GET.get("limit", 10))
            leaderboard = leaderboard[:limit]
            
            return Response({
                "leaderboard": leaderboard,
                "workspace_slug": slug,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": "Failed to fetch leaderboard data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProjectLeaderboardAPIEndpoint(BaseAPIView):
    """Project Leaderboard API Endpoint"""
    
    permission_classes = [
        IsAuthenticated,
        ProjectEntityPermission,
    ]

    def get(self, request, slug, project_id):
        """Get project-specific leaderboard data"""
        try:
            # Get leaderboard data filtered by project members
            from plane.db.models import ProjectMember
            
            # Get project members
            project_members = ProjectMember.objects.filter(
                project_id=project_id
            ).select_related('member__profile')
            
            leaderboard = []
            for member in project_members:
                if member.member.profile and member.member.profile.gamification_score > 0:
                    progress_info = get_rank_progress(member.member.profile.gamification_score)
                    leaderboard.append({
                        "user_id": member.member.id,
                        "display_name": member.member.display_name,
                        "username": member.member.username,
                        "score": member.member.profile.gamification_score,
                        "tasks_completed": member.member.profile.tasks_completed,
                        "rank": member.member.profile.gamification_rank,
                        "rank_description": progress_info["current_rank_description"],
                        "last_rank_upgrade": member.member.profile.last_rank_upgrade,
                    })
            
            # Sort by score and limit results
            leaderboard.sort(key=lambda x: x["score"], reverse=True)
            limit = int(request.GET.get("limit", 10))
            leaderboard = leaderboard[:limit]
            
            return Response({
                "leaderboard": leaderboard,
                "project_id": project_id,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": "Failed to fetch project leaderboard data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
