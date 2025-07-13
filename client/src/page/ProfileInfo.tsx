import { useParams } from "react-router-dom";
import type { GitHubApiUser, GitHubUser } from "../constants/common.types";
import { mapGitHubResponse } from "../helper/simplifyGitHubResponse";
import { Box, Divider } from "@mui/material";
import UserProfileHeader from "../components/UserProfileHeader";
import UserProfileStats from "../components/UserProfileStats";
import useFetchUserData from "../hooks/useFetchUserData";

const ProfileInfo = () => {
  const { username } = useParams();

  const { userData, userLoading, userError } = useFetchUserData({
    username: username || "demoUserName",
  });

  if (!userData) return null;
  const userProfile: GitHubUser = mapGitHubResponse(userData as GitHubApiUser);
  if (userLoading) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError.message}</div>;

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
      </Box>
    </>
  );
};

export default ProfileInfo;
