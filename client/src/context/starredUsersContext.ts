import { createContext } from "react";

type StarredUsersContextType = {
  starredList: string[];
  checkStarred: (value: string) => boolean;
  toggleStarred: (value: string) => void;
};

const starredUsersContext = createContext<StarredUsersContextType | null>(null);

export default starredUsersContext;
