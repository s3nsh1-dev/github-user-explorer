import { createContext } from "react";

type staredValueType = {
  staredList: string[];
  updateStaredList: (value: string) => void;
};

const startedUserContext = createContext<staredValueType>({
  staredList: [],
  updateStaredList: () => {},
});

export default startedUserContext;
