import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import UserCards from "../components/UserCards";

type UserObjectType = {
  login: string;
  avatar_url: string;
  html_url: string;
  id: number;
  repos_url: string;
};

const gitHub_authentication_token = import.meta.env
  .VITE_GITHUB_AUTHENTICATION_TOKEN;

const Explorer = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const URL = `https://api.github.com/search/users?q=${query}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", query],
    queryFn: async () => {
      if (!query) {
        throw new Error("Search query is required");
      }
      const response = await fetch(URL, {
        headers: {
          Authorization: "Bearer " + gitHub_authentication_token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data from GitHub API");
      }
      return await response.json();
    },
    enabled: !!query, // Only run the query if query is not null
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
