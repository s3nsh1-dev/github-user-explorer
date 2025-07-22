import { createContext } from "react";

type staredValueType = {
  staredList: string[];
};

const startedUserContext = createContext<staredValueType>({
  staredList: [],
});

export default startedUserContext;
