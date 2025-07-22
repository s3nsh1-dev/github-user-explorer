import startedUserContext from "./staredUsersContext";
import { useState } from "react";

type PropType = {
  children: React.ReactNode;
};

const StaredUserContextProvider: React.FC<PropType> = ({ children }) => {
  const initialList: string[] = JSON.parse(
    window.localStorage.getItem("staredProfiles") || "[]"
  );
  const [staredList, setStaredList] = useState<string[]>(initialList);

  const addStaredUser = (value: string) => {
    setStaredList((prev) => {
      const updated = [...prev, value];
      window.localStorage.setItem("staredProfiles", JSON.stringify(updated));
      return updated;
    });
  };

  const checkStared = (value: string) => {
    return initialList.includes(value);
  };

  const removeStaredUser = (value: string) => {
    setStaredList((prev) => {
      const updated = prev.filter((item) => item !== value);
      window.localStorage.setItem("staredProfiles", JSON.stringify(updated));
      return updated;
    });
  };

  const updateStaredList = (value: string) => {
    if (initialList.includes(value)) {
      removeStaredUser(value);
    } else {
      addStaredUser(value);
    }
  };

  return (
    <startedUserContext.Provider
      value={{ staredList, checkStared, updateStaredList }}
    >
      {children}
    </startedUserContext.Provider>
  );
};

export default StaredUserContextProvider;
