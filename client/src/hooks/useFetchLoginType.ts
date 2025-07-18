import { useQuery } from "@tanstack/react-query";

const useFetchLoginType = (username: string) => {
  const fetchedData = useQuery({
    queryKey: [username, "loginType"],
    queryFn: () => {},
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
  return fetchedData;
};
export default useFetchLoginType;
