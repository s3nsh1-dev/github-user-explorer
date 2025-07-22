import startedUserContext from "./staredUsersContext";
import { useState } from "react";

type PropType = {
  children: React.ReactNode;
};

const StaredUserContextProvider: React.FC<PropType> = ({ children }) => {
  const fetchingStaredList: string[] = JSON.parse(
    window.localStorage.getItem("staredProfiles") || "[]"
  );
  const [staredList, setStaredList] = useState<string[]>(fetchingStaredList);
  const updateStaredList = (value: string) => {
    setStaredList((prev) => {
      return [...prev, ...[value]];
    });
  };
  return (
    <startedUserContext.Provider
      value={{ staredList: staredList, updateStaredList }}
    >
      {children}
    </startedUserContext.Provider>
  );
};

export default StaredUserContextProvider;
