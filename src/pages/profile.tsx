import {useParams, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";

import {getUserByUsername} from "../services/firebase";
import * as ROUTES from "../constants/routes";
import UserProfile from "../components/profile";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  const {username} = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    async function checkUserExists() {
      if (!username) navigate(ROUTES.DASHBOARD);
      const [user]: any = await getUserByUsername(username as string);
      if (user?.userId) {
        setUser(user);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    }

    checkUserExists();
  }, [username, history]);

  return user?.username ? (
    <div className="container mx-auto bg-gray-200 p-3 rounded-md">
      <UserProfile user={user} />
    </div>
  ) : null;
}
