import useFetchReposPerPage from "../hooks/useFetchReposPerPage";
import { useParams, useSearchParams } from "react-router-dom";
import UserProfileRepos from "../components/UserProfileRepos";
import { Box, Typography } from "@mui/material";
import ShowColorChangingUserName from "../components/ShowColorChangingUserName";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

type IncomingPropTypes = {
  totalRepos: number;
};

const DisplayRepoList: React.FC<IncomingPropTypes> = ({ totalRepos }) => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  const pNum = parseInt(searchParams.get("page") || "1", 10);
  const { reposData, reposLoading, reposError } = useFetchReposPerPage({
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
  if (reposError) return <div>Error: {reposError.message}</div>;

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
      <UserProfileRepos
        repos={reposData}
        username={username || "demoUserName"}
      />
    </Box>
  );
};

export default DisplayRepoList;
