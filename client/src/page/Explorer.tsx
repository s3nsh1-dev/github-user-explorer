import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import UserCards from "../components/UserCards";
import useInfiniteUsers from "../hooks/useInfiniteUsers";
import { useEffect, useRef } from "react";
import { CircularProgress } from "@mui/material";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";

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
};
const style5 = { textAlign: "center", mt: 2 };
const style6 = {
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

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
    refetch,
  } = useInfiniteUsers(query ?? "");

  const loadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    const currentElement = loadRef.current;
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Visiting /explore directly used to run a real GitHub search for the
  // placeholder string and render "Matching Results : 0" over an empty grid.
  // The hook is disabled on an empty query, so this branch fires nothing.
  if (!query)
    return (
      <EmptyState
        icon={<SearchIcon fontSize="large" />}
        title="Search for a GitHub user"
        message="Enter a username on the home page to see matching profiles."
      />
    );

  if (isLoading)
    return (
      <Box sx={style6}>
        <CircularProgress />
      </Box>
    );
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  // A search that matched nothing is not a success worth celebrating, and it
  // used to get both "Matching Results : 0" and the 🎉 end-of-results banner,
  // because hasNextPage is false in that case too. Keep 🎉 for "you scrolled
  // through everything".
  if ((data?.pages[0]?.total_count ?? 0) === 0)
    return (
      <EmptyState
        icon={<SearchOffIcon fontSize="large" />}
        title="No users found"
        message={`Nothing on GitHub matched “${query}”. Check the spelling, or try a different username.`}
      />
    );

  const renderUserCards = data?.pages.flatMap((page) =>
    page.items.map((user) => {
      return (
        <UserCards
          key={user.id}
          userName={user.login}
          githubURL={user.html_url}
          imageURL={user.avatar_url}
        />
      );
    })
  );
  return (
    <Box sx={style1}>
      <Typography sx={style2}>
        Matching Results : {data?.pages[0].total_count}
      </Typography>
      <Box sx={style3}>{renderUserCards}</Box>
      {hasNextPage && (
        <Box ref={loadRef} sx={style6}>
          {isFetchingNextPage && <CircularProgress color="inherit" />}
        </Box>
      )}

      {!hasNextPage && (
        <Box sx={style5}>🎉 You’ve reached the end of results!</Box>
      )}
    </Box>
  );
};

export default Explorer;
