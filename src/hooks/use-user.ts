import {useState, useEffect} from "react";

import {getUserByUserId} from "../services/firebase";

export default function useUser(userId: string) {
  const [activeUser, setActiveUser] = useState<any>();

  useEffect(() => {
    async function getUserObjByUserId(userId: string) {
      const [user] = await getUserByUserId(userId);
      setActiveUser(user || {});
    }

    if (userId) {
      getUserObjByUserId(userId);
    }
  }, [userId]);

  return {user: activeUser, setActiveUser};
}
