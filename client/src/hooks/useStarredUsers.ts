import starredUsersContext from "../context/starredUsersContext";
import { useContext } from "react";

/**
 * Throws, like `useMode`, rather than returning null.
 *
 * Returning null forced optional chaining at every call site
 * (`starredContext?.toggleStarred(...)`), which turns a wiring mistake into
 * a star button that silently does nothing. Now that the provider is mounted
 * once at the root, the null case cannot legitimately occur.
 */
const useStarredUsers = () => {
  const context = useContext(starredUsersContext);

  if (!context) {
    throw new Error("Starred users context is null");
  }

  return context;
};
export default useStarredUsers;
