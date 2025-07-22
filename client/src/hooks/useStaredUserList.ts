import startedUserContext from "../context/staredUsersContext";
import { useContext } from "react";

const useStartedUserList = () => {
  const starUserContext = useContext(startedUserContext);

  if (!starUserContext) {
    return null;
  }
  return {
    staredList: starUserContext.staredList,
    updateStaredList: starUserContext.updateStaredList,
  };
};
export default useStartedUserList;
