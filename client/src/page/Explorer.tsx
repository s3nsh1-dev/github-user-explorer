import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import UserCards from "../components/UserCards";
// import useFetchSearchUsers from "../hooks/useFetchSearchUsers";
// import type { UserObjectType } from "../constants/common.types";
import useInfiniteUsers from "../hooks/useInfiniteUsers";

const Explorer = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteUsers(query || "noQueryToSearch");

  if (isLoading) return <div>....Loading</div>;
  if (error) return <div>Error Message: {error.message}</div>;
  console.log(data);

  const renderUserCards = data?.pages.flatMap((page) =>
    page.items.map((user) => {
      return (
        <UserCards
          key={user.id}
          userName={user.login}
          githubURL={user.html_url}
          imageURL={user.avatar_url}
          seeRepos={user.repos_url}
        />
      );
    })
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography
        sx={{
          textAlign: "center",
          margin: "15px 0px 5px 0px",
          fontFamily: "monospace",
        }}
      >
        Matching Results : {data?.pages[0].total_count}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          // paddingRight: 10,
        }}
      >
        {renderUserCards}
      </Box>
      {hasNextPage && (
        <Button
          variant="contained"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          sx={{ mt: 2, alignSelf: "center" }}
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}

      {!hasNextPage && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          🎉 You’ve reached the end of results!
        </Box>
      )}
    </Box>
  );
};

export default Explorer;
