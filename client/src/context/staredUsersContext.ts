import { createContext } from "react";

type staredValueType = {
  staredList: string[];
  checkStared: (value: string) => boolean;
  updateStaredList: (value: string) => void;
};

const startedUserContext = createContext<staredValueType | null>(null);

export default startedUserContext;
