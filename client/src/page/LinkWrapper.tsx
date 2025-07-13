import { useSearchParams } from "react-router-dom";
import ProfileInfo from "./ProfileInfo";
import Repositories from "./Repositories";

const LinkWrapper = () => {
  const [searchParams] = useSearchParams();
  const value = searchParams.get("tab") || "overview";
  console.log("what is Wrapper", value);
  return value === "overview" ? <ProfileInfo /> : <Repositories />;
};

export default LinkWrapper;
