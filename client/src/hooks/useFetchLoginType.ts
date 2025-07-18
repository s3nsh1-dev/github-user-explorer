import { useQuery } from "@tanstack/react-query";

const TOKEN = import.meta.env.VITE_GITHUB_AUTHENTICATION_TOKEN;

const useFetchLoginType = (username: string) => {
  const queryBodyToFetchLoginType = `
      {
        repositoryOwner(login: "${username}") {
          __typename
        }
      }`;
  const fetchedData = useQuery({
    queryKey: [username, "loginType"],
    queryFn: async () => {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryBodyToFetchLoginType }),
      });

      if (!response.ok) {
        throw new Error("Response for LongType was not ok");
      }
      const responseData = await response.json();
      return responseData;
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
  return fetchedData;
};
export default useFetchLoginType;
