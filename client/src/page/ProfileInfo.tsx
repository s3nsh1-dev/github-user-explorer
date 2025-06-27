import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { GitHubApiUser, GitHubUser } from "../constants/common.types";
import { mapGitHubResponse } from "../helper/simplifyGitHubResponse";
import { Box, Divider } from "@mui/material";
import UserProfileHeader from "../components/UserProfileHeader";
import UserProfileStats from "../components/UserProfileStats";
import UserProfileRepos from "../components/UserProfileRepos";

const ProfileInfo = () => {
  const { username } = useParams();
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error("Failed to fetch user profile");
      return await response.json();
    },
    enabled: !!username,
  });

  const {
    data: reposData,
    isLoading: reposLoading,
    error: reposError,
  } = useQuery({
    queryKey: ["userRepos", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      if (!response.ok) throw new Error("Failed to fetch user repositories");
      return await response.json();
    },
    enabled: !!username,
  });

  if (userLoading || reposLoading) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError.message}</div>;
  if (reposError) return <div>Error: {reposError.message}</div>;

  const userProfile: GitHubUser = mapGitHubResponse(userData as GitHubApiUser);
  const repos = Array.isArray(reposData) ? reposData : [];

  return (
    <Box maxWidth={1000} mx="auto" mt={4} px={3}>
      <UserProfileHeader userProfile={userProfile} />
      <UserProfileStats userProfile={userProfile} />
      <Divider sx={{ my: 3 }} />
      <UserProfileRepos repos={repos} />
    </Box>
  );
};

export default ProfileInfo;
