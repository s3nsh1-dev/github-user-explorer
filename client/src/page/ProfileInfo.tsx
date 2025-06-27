import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { GitHubApiUser, GitHubUser } from "../constants/common.types";
import { mapGitHubResponse } from "../helper/simplifyGitHubResponse";
import { Box, Divider } from "@mui/material";
import UserProfileHeader from "../components/UserProfileHeader";
import UserProfileStats from "../components/UserProfileStats";
import UserProfileRepos from "../components/UserProfileRepos";

const gitHub_authentication_token = import.meta.env
  .VITE_GITHUB_AUTHENTICATION_TOKEN;

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
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `Bearer ${gitHub_authentication_token}`,
        },
      });
      console.log("fetching user info for", username);
      if (!response.ok) throw new Error("Failed to fetch user profile");
      return await response.json();
    },
    enabled: !!username,
    // how long the data will be considered fresh = stale time(in this case 5min)
    staleTime: 1000 * 60 * 5,
    /*
    // 10 mins in memory, the default is 5 min
    // using to not hit the api again and again if the request is frequent
    cacheTime: 1000 * 60 * 10
    */
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
        `https://api.github.com/users/${username}/repos`,
        {
          headers: {
            Authorization: `Bearer ${gitHub_authentication_token}`,
          },
        }
      );
      console.log("fetching repos for", username);
      if (!response.ok) throw new Error("Failed to fetch user repositories");
      return await response.json();
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  if (userLoading || reposLoading) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError.message}</div>;
  if (reposError) return <div>Error: {reposError.message}</div>;

  const userProfile: GitHubUser = mapGitHubResponse(userData as GitHubApiUser);
  const repos = Array.isArray(reposData) ? reposData : [];

  return (
    <>
      <Box maxWidth={1000} mx="auto" px={3}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <UserProfileHeader userProfile={userProfile} />
          <UserProfileStats userProfile={userProfile} />
        </div>
        <Divider sx={{ my: 3 }} />
        <UserProfileRepos repos={repos} />
      </Box>
    </>
  );
};

export default ProfileInfo;
