import { useQuery } from "@tanstack/react-query";

const gitHub_authentication_token = import.meta.env
  .VITE_GITHUB_AUTHENTICATION_TOKEN;

const useFetchUserData = ({ username }: { username: string }) => {
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `Bearer ${gitHub_authentication_token}`,
        },
      });
      console.log("fetching user info for", username);
      if (!response.ok) throw new Error("Failed to fetch user profile");
      return await response.json();
    },
    enabled: !!username,
    // how long the data will be considered fresh = stale time(in this case 5min)
    staleTime: 1000 * 60 * 5,
    /*
      // 10 mins in memory, the default is 5 min
      // using to not hit the api again and again if the request is frequent
      cacheTime: 1000 * 60 * 10
      */
  });
  return { userData, userLoading, userError };
};

export default useFetchUserData;
