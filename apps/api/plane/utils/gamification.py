# Python imports
from typing import Dict, List, Tuple
from django.utils import timezone

# Gamification system for Warhammer 40k themed task completion


# Warhammer 40k Imperial Guard Ranks
GAMIFICATION_RANKS = {
    "Initiate": {"min_score": 0, "max_score": 9, "description": "Fresh recruit to the Imperial Guard"},
    "Guardsman": {"min_score": 10, "max_score": 49, "description": "Basic soldier in the Imperial Guard"},
    "Veteran": {"min_score": 50, "max_score": 99, "description": "Experienced fighter with battle scars"},
    "Sergeant": {"min_score": 100, "max_score": 199, "description": "Squad leader commanding fellow soldiers"},
    "Lieutenant": {"min_score": 200, "max_score": 399, "description": "Junior officer with command responsibility"},
    "Captain": {"min_score": 400, "max_score": 699, "description": "Company commander leading hundreds"},
    "Colonel": {"min_score": 700, "max_score": 999, "description": "Regiment commander with vast experience"},
    "General": {"min_score": 1000, "max_score": float('inf'), "description": "High command with legendary status"},
}

# Priority multipliers for scoring
PRIORITY_MULTIPLIERS = {
    "urgent": 2.0,    # +2 points
    "high": 1.5,      # +1 point  
    "medium": 1.0,    # +0 points
    "low": 0.5,       # -1 point (but minimum 0.1)
    "none": 1.0,      # +0 points
}


def calculate_task_score(priority: str = "none", estimate_point_key: int = None) -> float:
    """
    Calculate the score for completing a task based on priority and complexity.
    
    Args:
        priority: Task priority (urgent, high, medium, low, none)
        estimate_point_key: Complexity score from estimate_point (0-12)
    
    Returns:
        Float score for the task
    """
    # Base score is always 1
    base_score = 1.0
    
    # Apply priority multiplier
    priority_multiplier = PRIORITY_MULTIPLIERS.get(priority, 1.0)
    score = base_score * priority_multiplier
    
    # Apply complexity multiplier if estimate_point exists
    if estimate_point_key is not None:
        # Ensure estimate_point_key is between 0-12, default to 1 if invalid
        complexity = max(1, min(12, estimate_point_key))
        score *= complexity
    
    # Ensure minimum score of 0.1
    return max(0.1, score)


def get_rank_for_score(score: int) -> str:
    """
    Get the appropriate rank for a given score.
    
    Args:
        score: Total gamification score
        
    Returns:
        Rank name as string
    """
    for rank_name, rank_data in GAMIFICATION_RANKS.items():
        if rank_data["min_score"] <= score <= rank_data["max_score"]:
            return rank_name
    
    # Fallback to highest rank if score exceeds all ranges
    return "General"


def get_rank_progress(score: int) -> Dict[str, any]:
    """
    Get progress information for the current rank.
    
    Args:
        score: Current total score
        
    Returns:
        Dictionary with rank progress information
    """
    current_rank = get_rank_for_score(score)
    rank_data = GAMIFICATION_RANKS[current_rank]
    
    # Calculate progress within current rank
    current_rank_progress = score - rank_data["min_score"]
    current_rank_range = rank_data["max_score"] - rank_data["min_score"]
    progress_percentage = (current_rank_progress / current_rank_range * 100) if current_rank_range > 0 else 100
    
    # Get next rank info
    rank_names = list(GAMIFICATION_RANKS.keys())
    current_rank_index = rank_names.index(current_rank)
    next_rank = rank_names[current_rank_index + 1] if current_rank_index < len(rank_names) - 1 else None
    next_rank_data = GAMIFICATION_RANKS[next_rank] if next_rank else None
    
    # Points needed for next rank
    points_to_next = 0
    if next_rank and next_rank_data:
        points_to_next = next_rank_data["min_score"] - score
    
    return {
        "current_rank": current_rank,
        "current_rank_description": rank_data["description"],
        "score": score,
        "progress_percentage": min(100, progress_percentage),
        "points_in_current_rank": current_rank_progress,
        "max_points_in_current_rank": current_rank_range,
        "next_rank": next_rank,
        "next_rank_description": next_rank_data["description"] if next_rank_data else None,
        "points_to_next_rank": points_to_next,
        "is_max_rank": current_rank == "General",
    }


def update_user_gamification(user_profile, task_score: float, task_priority: str = "none", estimate_point_key: int = None) -> Dict[str, any]:
    """
    Update user's gamification score and rank when completing a task.
    
    Args:
        user_profile: User Profile instance
        task_score: Score calculated for the completed task
        task_priority: Priority of the completed task
        estimate_point_key: Complexity score of the completed task
        
    Returns:
        Dictionary with updated gamification information
    """
    # Calculate the score for this task
    calculated_score = calculate_task_score(task_priority, estimate_point_key)
    
    # Update user's total score and task count
    old_score = user_profile.gamification_score
    old_rank = user_profile.gamification_rank
    
    user_profile.gamification_score += int(calculated_score)
    user_profile.tasks_completed += 1
    
    # Check if rank has changed
    new_rank = get_rank_for_score(user_profile.gamification_score)
    rank_changed = new_rank != old_rank
    
    if rank_changed:
        user_profile.gamification_rank = new_rank
        user_profile.last_rank_upgrade = timezone.now()
    
    # Save the profile
    user_profile.save(update_fields=[
        'gamification_score', 
        'tasks_completed', 
        'gamification_rank', 
        'last_rank_upgrade'
    ])
    
    # Get updated progress info
    progress_info = get_rank_progress(user_profile.gamification_score)
    
    return {
        "rank_changed": rank_changed,
        "old_rank": old_rank,
        "new_rank": new_rank,
        "old_score": old_score,
        "new_score": user_profile.gamification_score,
        "task_score_earned": calculated_score,
        "progress_info": progress_info,
    }


def get_leaderboard_data(workspace_id: str = None, limit: int = 10) -> List[Dict[str, any]]:
    """
    Get leaderboard data for gamification scores.
    
    Args:
        workspace_id: Optional workspace filter
        limit: Number of top users to return
        
    Returns:
        List of user gamification data sorted by score
    """
    from plane.db.models import Profile, WorkspaceMember
    
    # Base queryset
    queryset = Profile.objects.select_related('user').filter(
        gamification_score__gt=0
    ).order_by('-gamification_score')
    
    # Filter by workspace if provided
    if workspace_id:
        workspace_members = WorkspaceMember.objects.filter(
            workspace_id=workspace_id
        ).values_list('member_id', flat=True)
        queryset = queryset.filter(user_id__in=workspace_members)
    
    # Get top users with their progress info
    leaderboard = []
    for profile in queryset[:limit]:
        progress_info = get_rank_progress(profile.gamification_score)
        leaderboard.append({
            "user_id": profile.user.id,
            "display_name": profile.user.display_name,
            "username": profile.user.username,
            "score": profile.gamification_score,
            "tasks_completed": profile.tasks_completed,
            "rank": profile.gamification_rank,
            "rank_description": progress_info["current_rank_description"],
            "last_rank_upgrade": profile.last_rank_upgrade,
        })
    
    return leaderboard
