import useFetchUserRepoDetails from "../hooks/useFetchUserRepoDetails";
import { useParams, useSearchParams } from "react-router-dom";
import UserProfileRepos from "../components/UserProfileRepos";
import { Box } from "@mui/material";

const Repositories = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const pNum = parseInt(searchParams.get("page") || "1", 10);
  const { reposData, reposLoading, reposError } = useFetchUserRepoDetails({
    username: username || "demoUserName",
    page: pNum,
  });

  if (reposLoading) return <div>Loading...</div>;
  if (reposError) return <div>Error: {reposError.message}</div>;
  console.log(reposData, pNum);

  return (
    <Box maxWidth={1000} mx="auto" px={3} py={1}>
      <UserProfileRepos
        repos={reposData}
        totalRepos={reposData.length}
        username={username || "demoUserName"}
      />
    </Box>
  );
};

export default Repositories;
