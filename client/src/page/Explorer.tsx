import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import UserCards from "../components/UserCards";
import useInfiniteUsers from "../hooks/useInfiniteUsers";

const style1 = { display: "flex", flexDirection: "column", gap: 2 };
const style2 = {
  textAlign: "center",
  margin: "15px 0px 5px 0px",
  fontFamily: "monospace",
};
const style3 = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  // paddingRight: 10,
};
const style4 = { mt: 2, alignSelf: "center", mb: 2 };
const style5 = { textAlign: "center", mt: 2 };

const Explorer = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteUsers(query || "noQueryToSearch");

  if (isLoading) return <div>....Loading</div>;
  if (error) return <div>Error Message: {error.message}</div>;

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
  console.log("see last page", data?.pages);
  return (
    <Box sx={style1}>
      <Typography sx={style2}>
        Matching Results : {data?.pages[0].total_count}
      </Typography>
      <Box sx={style3}>{renderUserCards}</Box>
      {hasNextPage && (
        <Button
          variant="contained"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          sx={style4}
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}

      {!hasNextPage && (
        <Box sx={style5}>🎉 You’ve reached the end of results!</Box>
      )}
    </Box>
  );
};

export default Explorer;
