import { useSearchParams } from "react-router-dom";
import ProfileInfo from "./ProfileInfo";
import Repositories from "./Repositories";

const LinkWrapper = () => {
  const [searchParams] = useSearchParams();
  const value = searchParams.get("tab");
  if (value == "repositories") return <Repositories />;
  return <ProfileInfo />;
};

export default LinkWrapper;
