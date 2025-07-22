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
      if (!prev.includes(value)) {
        const updated = [...prev, value];
        window.localStorage.setItem("staredProfiles", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const checkStared = (value: string) => {
    // console.log("i");
    return initialList.includes(value);
  };

  const removeStaredUser = (value: string) => {
    setStaredList((prev) => {
      const updated = prev.filter((item) => item !== value);
      window.localStorage.setItem("staredProfiles", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <startedUserContext.Provider
      value={{ staredList, checkStared, removeStaredUser, addStaredUser }}
    >
      {children}
    </startedUserContext.Provider>
  );
};

export default StaredUserContextProvider;
