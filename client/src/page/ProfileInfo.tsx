import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { GitHubApiUser, GitHubUser } from "../constants/common.types";
import { mapGitHubResponse } from "../helper/simplifyGitHubResponse";

const ProfileInfo = () => {
  const { username } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      if (!username) {
        throw new Error("Username is required");
      }
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return await response.json();
    },
    enabled: !!username, // Only run the query if username is not null
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const userProfile: GitHubUser = mapGitHubResponse(data as GitHubApiUser);
  console.log(userProfile);

  return <div>Profile Info</div>;
};

export default ProfileInfo;
