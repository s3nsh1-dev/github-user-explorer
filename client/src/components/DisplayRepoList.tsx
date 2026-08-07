import useFetchReposPerPage from "../hooks/useFetchReposPerPage";
import { useParams, useSearchParams } from "react-router-dom";
import UserProfileRepos from "../components/UserProfileRepos";
import { Box, Typography } from "@mui/material";
import ShowColorChangingUserName from "../components/ShowColorChangingUserName";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { parsePage } from "../helper/parsePage";
import ErrorState from "./ErrorState";

type IncomingPropTypes = {
  totalRepos: number;
};

const DisplayRepoList: React.FC<IncomingPropTypes> = ({ totalRepos }) => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  const pNum = parsePage(searchParams.get("page"));
  const {
    data: reposData,
    isLoading: reposLoading,
    error: reposError,
    refetch: refetchRepos,
  } = useFetchReposPerPage({
    username: username || "demoUserName",
    page: pNum,
  });

  if (reposLoading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (reposError)
    return <ErrorState error={reposError} onRetry={refetchRepos} />;

  return (
    <Box maxWidth={1000} minHeight={"80vh"} mx="auto" px={3} py={1}>
      <Box fontFamily="monospace" marginY={2}>
        <Link
          to={`/user/${username}`}
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          <ShowColorChangingUserName username={username || "demoUserName"} />
        </Link>
        <Typography>
          <b>{totalRepos}</b> <i>repositories</i>
        </Typography>
      </Box>
      {/* A disabled query is neither loading nor errored, so `reposData` can
          still be undefined here — which used to reach `repos.length` and
          throw. `UserProfileRepos` already renders an empty list honestly. */}
      <UserProfileRepos repos={reposData ?? []} />
    </Box>
  );
};

export default DisplayRepoList;
