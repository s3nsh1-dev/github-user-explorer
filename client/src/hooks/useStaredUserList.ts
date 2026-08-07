import startedUserContext from "../context/staredUsersContext";
import { useContext } from "react";

/**
 * Throws, like `useMode`, rather than returning null.
 *
 * Returning null forced optional chaining at every call site
 * (`staredContext?.updateStaredList(...)`), which turns a wiring mistake into
 * a star button that silently does nothing. Now that the provider is mounted
 * once at the root, the null case cannot legitimately occur.
 */
const useStartedUserList = () => {
  const starUserContext = useContext(startedUserContext);

  if (!starUserContext) {
    throw new Error("Stared user context is null");
  }

  return starUserContext;
};
export default useStartedUserList;
