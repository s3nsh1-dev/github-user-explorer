import startedUserContext from "./staredUsersContext";

type PropType = {
  children: React.ReactNode;
};

const StaredUserContextProvider: React.FC<PropType> = ({ children }) => {
  const staredList: string[] = JSON.parse(
    window.localStorage.getItem("staredProfiles") || "[]"
  );
  return (
    <startedUserContext.Provider value={{ staredList: staredList }}>
      {children}
    </startedUserContext.Provider>
  );
};

export default StaredUserContextProvider;
