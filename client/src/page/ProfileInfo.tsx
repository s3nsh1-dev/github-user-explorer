import { useParams } from "react-router-dom";
import type { GitHubApiUser, GitHubUser } from "../constants/common.types";
import { mapGitHubResponse } from "../helper/simplifyGitHubResponse";
import { Box, Divider } from "@mui/material";
import UserProfileHeader from "../components/UserProfileHeader";
import UserProfileStats from "../components/UserProfileStats";
import useFetchUserData from "../hooks/useFetchUserData";
import Typography from "@mui/material/Typography";

const ProfileInfo = () => {
  const { username } = useParams();

  const { userData, userLoading, userError } = useFetchUserData({
    username: username || "demoUserName",
  });

  if (!userData) return null;
  const userProfile: GitHubUser = mapGitHubResponse(userData as GitHubApiUser);
  if (userLoading) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError.message}</div>;
  console.log("ProfileInfo", userData);

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
        <Box>
          <Divider sx={{ my: 3 }} />

          <Typography>📝 Bio: {userProfile.bio}</Typography>
          <Typography>🏢 Work: {userProfile.company}</Typography>
          <Typography>💼 Looking for Job: {userProfile.hirable}</Typography>
          <Typography>📧 Em@il: {userProfile.email}</Typography>
          <Typography>🔗 Blog: {userProfile.blog}</Typography>
          <Typography>
            🌐 Social Media:{" "}
            {userProfile.x_handle !== "Not Provided" ? (
              <a
                href={`https://x.com/${userProfile.x_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit", fontWeight: "bold" }}
              >
                {userProfile.x_handle}
              </a>
            ) : (
              "Not Provided"
            )}
          </Typography>
          <Typography>
            📅 Joined:{" "}
            {new Date(userProfile.joined).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>

          <Typography>
            ⏱️ Last Active:{" "}
            {new Date(userProfile.lastActive).toLocaleString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ProfileInfo;
