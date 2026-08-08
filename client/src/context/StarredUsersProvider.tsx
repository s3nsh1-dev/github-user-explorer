import { useCallback, useEffect, useMemo, useState } from "react";
import starredUsersContext from "./starredUsersContext";
import { readStarred, writeStarred } from "../helper/storage";

/**
 * Three bugs used to cancel each other out here, which is why they had to be
 * fixed together. report/suggestions/06.
 *
 *   1. `initialList` was a plain `const` — a synchronous `localStorage` read
 *      and `JSON.parse` on **every render**.
 *   2. `checkStarred` and `toggleStarred` read that storage snapshot rather
 *      than the state.
 *   3. The `localStorage` write happened **inside the state updater**, which
 *      React requires to be pure and calls twice under StrictMode.
 *
 * Because (1) re-read storage every render and (3) wrote synchronously, (2)
 * accidentally stayed in sync. Fixing (1) alone — the obvious change, a lazy
 * `useState` initialiser — freezes the snapshot at mount and the star icon
 * stops toggling.
 *
 * So: lazy initialiser (read once), reads from state, and the write moved to
 * an effect where a side effect belongs.
 *
 * ⚠️ The hoist to `main.tsx` is part of the same fix, not tidying. The
 * provider used to be mounted **twice, independently** — once in `UpperHomeUI`
 * and once in `ProfileInfo` — so `localStorage`, not context, was doing the
 * state sharing. Two live instances plus an effect that writes on every change
 * would overwrite each other's list.
 */
type PropType = {
  children: React.ReactNode;
};

const StarredUsersProvider: React.FC<PropType> = ({ children }) => {
  // Lazy initialiser: `readStarred` runs once, at mount.
  const [starredList, setStarredList] = useState<string[]>(readStarred);

  // Persisting is a side effect of the list changing. Running on mount too is
  // deliberate — it writes back P17's sanitised list, so junk is dropped once
  // rather than re-filtered on every load.
  useEffect(() => {
    writeStarred(starredList);
  }, [starredList]);

  const checkStarred = useCallback(
    (value: string) => starredList.includes(value),
    [starredList]
  );

  const toggleStarred = useCallback((value: string) => {
    // A pure updater: no storage write in here. StrictMode calls it twice.
    setStarredList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  }, []);

  // Without this every provider render hands consumers a brand-new object.
  const value = useMemo(
    () => ({ starredList, checkStarred, toggleStarred }),
    [starredList, checkStarred, toggleStarred]
  );

  return (
    <starredUsersContext.Provider value={value}>
      {children}
    </starredUsersContext.Provider>
  );
};

export default StarredUsersProvider;
