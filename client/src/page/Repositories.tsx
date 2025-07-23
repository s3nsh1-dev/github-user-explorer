import useFetchReposPerPage from "../hooks/useFetchReposPerPage";
import { useParams, useSearchParams } from "react-router-dom";
import UserProfileRepos from "../components/UserProfileRepos";
import { Box, Typography } from "@mui/material";
import ShowColorChangingUserName from "../components/ShowColorChangingUserName";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useState } from "react";

const Repositories = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const [pNum, setPnum] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  // const pNum = parseInt(searchParams.get("page") || "1", 10);
  console.log(pNum);
  const { reposData, reposLoading, reposError, totalRepos } =
    useFetchReposPerPage({
      username: username || "demoUserName",
      page: pNum,
    });

  if (reposLoading) return <div>Loading...</div>;
  if (reposError) return <div>Error: {reposError.message}</div>;
  console.log("rendering repos", totalRepos);

  return (
    <>
      <Box maxWidth={1000} mx="auto" px={3} py={1}>
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
      <Pagination
        page={pNum}
        username={username || "demoUserName"}
        totalRepos={totalRepos}
        changePageNumber={setPnum}
      />
    </>
  );
};

export default Repositories;
