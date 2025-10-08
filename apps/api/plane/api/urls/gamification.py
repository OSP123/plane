from django.urls import path

from plane.api.views.gamification import (
    UserGamificationAPIEndpoint,
    WorkspaceLeaderboardAPIEndpoint,
    ProjectLeaderboardAPIEndpoint,
)

urlpatterns = [
    path(
        "workspaces/<str:slug>/gamification/me/",
        UserGamificationAPIEndpoint.as_view(http_method_names=["get"]),
        name="user-gamification",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/gamification/",
        UserGamificationAPIEndpoint.as_view(http_method_names=["get"]),
        name="user-gamification-project",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/gamification/leaderboard/",
        ProjectLeaderboardAPIEndpoint.as_view(http_method_names=["get"]),
        name="project-leaderboard",
    ),
    path(
        "workspaces/<str:slug>/gamification/leaderboard/",
        WorkspaceLeaderboardAPIEndpoint.as_view(http_method_names=["get"]),
        name="workspace-leaderboard",
    ),
]
