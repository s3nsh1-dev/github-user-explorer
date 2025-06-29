import { useParams, useSearchParams } from "react-router-dom";
import type { GitHubApiUser, GitHubUser } from "../constants/common.types";
import { mapGitHubResponse } from "../helper/simplifyGitHubResponse";
import { Box, Divider } from "@mui/material";
import UserProfileHeader from "../components/UserProfileHeader";
import UserProfileStats from "../components/UserProfileStats";
import UserProfileRepos from "../components/UserProfileRepos";
import Pagination from "../components/Pagination";
import { useMemo } from "react";
import useFetchUserData from "../hooks/useFetchUserData";
import useFetchUserRepoDetails from "../hooks/useFetchUserRepoDetails";

const ProfileInfo = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const currentPageNumber = parseInt(searchParams.get("page") || "1", 10);
  console.log("currentPageNumber", currentPageNumber);
  const reposPerPage = 6;
  const startIndex = (currentPageNumber - 1) * reposPerPage;
  const endIndex = startIndex + reposPerPage;

  const { userData, userLoading, userError } = useFetchUserData({
    username: username || "demoUserName",
  });

  const { reposData, reposLoading, reposError } = useFetchUserRepoDetails({
    username: username || "demoUserName",
  });

  const repos = useMemo(
    () => (Array.isArray(reposData) ? reposData : []),
    [reposData]
  );

  const paginatedRepos = repos.slice(startIndex, endIndex);

  if (!userData) return null;
  const userProfile: GitHubUser = mapGitHubResponse(userData as GitHubApiUser);
  if (userLoading || reposLoading) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError.message}</div>;
  if (reposError) return <div>Error: {reposError.message}</div>;

  console.log("repos", reposData);

  return (
    <>
      <Box maxWidth={1000} mx="auto" px={3} py={1}>
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
        <UserProfileRepos repos={paginatedRepos} />
        <Pagination
          repos={repos}
          reposPerPage={reposPerPage}
          page={currentPageNumber}
          username={username || "unknown"}
        />
      </Box>
    </>
  );
};

export default ProfileInfo;
