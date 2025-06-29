import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import UserCards from "../components/UserCards";
import useFetchSearchUsers from "../hooks/useFetchSearchUsers";
import type { UserObjectType } from "../constants/common.types";

const Explorer = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const { data, isLoading, error } = useFetchSearchUsers({
    query: query || "noQueryToSearch",
  });

  if (isLoading) return <div>....Loading</div>;
  if (error) return <div>Error Message: {error.message}</div>;
  console.log(data);

  const renderUserCards = data.items.map((user: UserObjectType) => {
    return (
      <UserCards
        key={user.id}
        userName={user.login}
        githubURL={user.html_url}
        imageURL={user.avatar_url}
        seeRepos={user.repos_url}
      />
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
      }}
    >
      {renderUserCards}
    </Box>
  );
};

export default Explorer;
