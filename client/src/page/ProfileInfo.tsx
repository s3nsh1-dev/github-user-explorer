import { useParams } from "react-router-dom";
import type { GitHubApiUser, GitHubUser } from "../constants/common.types";
import { mapGitHubResponse } from "../helper/simplifyGitHubResponse";
import { Box, Divider } from "@mui/material";
import UserProfileHeader from "../components/UserProfileHeader";
import UserProfileStats from "../components/UserProfileStats";
import useFetchUserData from "../hooks/useFetchUserData";
import Paper from "@mui/material/Paper";
import useMode from "../hooks/useMode";
import Grid from "@mui/material/Grid";
import ContributionChart from "../components/ContributionChart";
import StaredUserContextProvider from "../context/StaredUserContextProvider";

const style1 = { my: 1, p: 1, display: "flex" };
const style2 = {
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  px: 1,
  fontFamily: "monospace",
};
const style4 = { px: 3, py: 1, mx: "auto", maxWidth: 1000 };
const style5 = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
};

const ProfileInfo = () => {
  const { mode } = useMode();
  const style3 = {
    color: mode === "dark" ? "#23272b" : "#e0e0e0",
    backgroundColor: mode === "dark" ? "#e0e0e0" : "#23272b",
    px: 1,
    py: 0.5,
    borderRadius: 1,
    wordWrap: "break-word",
    // wordBreak: "break-all",
    fontSize: { xs: ".9rem", sm: "1rem" },
    fontFamily: "monospace",
  };

  const { username } = useParams();
  const { userData, userLoading, userError } = useFetchUserData({
    username: username || "demoUserName",
  });

  if (!userData) return null;
  const userProfile: GitHubUser = mapGitHubResponse(userData as GitHubApiUser);
  if (userLoading) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError.message}</div>;

  const arrays = [
    { label: "📝 Bio", value: userProfile.bio },
    {
      label: "🏢 Work",
      value: `${userProfile.company}`,
    },
    { label: "💼 Hirable", value: userProfile.hirable },
    { label: "📧 Em@il", value: userProfile.email },
    {
      label: "🔗 Blog",
      value: userProfile.blog,
    },
    {
      label: "📅 Joined",
      value: new Date(userProfile.joined).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    {
      label: "⏱️ Last Active",
      value: new Date(userProfile.lastActive).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      label: "🌐 Social Media",
      value:
        userProfile.x_handle !== "Not Provided" ? (
          <a
            href={`https://x.com/${userProfile.x_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1DA1F2", fontWeight: "bold" }}
          >
            {userProfile.x_handle}
          </a>
        ) : (
          "Not Provided"
        ),
    },
  ];

  const renderOtherUserDetails = arrays.map((item, index) => {
    return (
      <Paper key={index} elevation={1} sx={style1}>
        <Grid container spacing={2} columns={12} width="100%">
          <Grid size={{ xs: 3, sm: 2.5 }} sx={style2}>
            {item.label}
          </Grid>
          <Grid size={{ xs: 9, sm: 9.5 }} sx={style3}>
            {item.value}
          </Grid>
        </Grid>
      </Paper>
    );
  });

  return (
    <Box sx={style4}>
      <Box sx={style5}>
        <StaredUserContextProvider>
          <UserProfileHeader userProfile={userProfile} />
        </StaredUserContextProvider>
        <UserProfileStats userProfile={userProfile} />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box>{renderOtherUserDetails}</Box>
      <ContributionChart username={username || "demoUserName"} />
    </Box>
  );
};

export default ProfileInfo;
