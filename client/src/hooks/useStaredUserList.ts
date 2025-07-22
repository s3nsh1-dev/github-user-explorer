import startedUserContext from "../context/staredUsersContext";
import { useContext } from "react";

const useStartedUserList = () => {
  const starUserContext = useContext(startedUserContext);

  if (!starUserContext) {
    return null;
  }

  return {
    staredList: starUserContext.staredList,
    checkStared: starUserContext.checkStared,
    removeStaredUser: starUserContext.removeStaredUser,
    addStaredUser: starUserContext.addStaredUser,
  };
};
export default useStartedUserList;
