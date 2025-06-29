import useShowIndividualRepo from "../hooks/useShowIndividualRepo";
import { useParams } from "react-router-dom";

const ShowSelectedRepo = () => {
  const { repoName, username } = useParams();
  console.log("ShowSelectedRepo :", repoName, username);
  const { data, isLoading, error } = useShowIndividualRepo({
    repoName: repoName || "demoRepo",
    username: username || "demoUserName",
  });
  console.log("Repo Fetch Data", data);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      Show individual Repo
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export default ShowSelectedRepo;
