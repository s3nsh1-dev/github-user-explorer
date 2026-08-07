import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import UserCards from "../components/UserCards";
import useInfiniteUsers from "../hooks/useInfiniteUsers";
import { useEffect, useRef } from "react";
import { CircularProgress } from "@mui/material";
import ErrorState from "../components/ErrorState";

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
  } = useInfiniteUsers(query || "noQueryToSearch");

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

  if (isLoading)
    return (
      <Box sx={style6}>
        <CircularProgress />
      </Box>
    );
  if (error) return <ErrorState error={error} onRetry={refetch} />;

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
