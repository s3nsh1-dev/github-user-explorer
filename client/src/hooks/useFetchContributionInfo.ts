import { useQuery } from "@tanstack/react-query";

const TOKEN = import.meta.env.VITE_GITHUB_AUTHENTICATION_TOKEN;

const useFetchContributionInfo = ({ username }: { username: string }) => {
  const query = `
{
  user(login: "${username}") {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
  }
}`;
  const result = useQuery({
    queryKey: ["contributionInfo", username],
    queryFn: async () => {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch contribution info");
      }
      return await response.json();
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
  return result;
};

export default useFetchContributionInfo;
