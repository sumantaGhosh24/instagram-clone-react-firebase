import {Navigate} from "react-router-dom";

import {useFirebase} from "../firebase/auth-context";

interface RequireGuestProps {
  children: any;
}

const RequireGuest = ({children}: RequireGuestProps) => {
  const firebase = useFirebase();

  return firebase.authUser ? <Navigate to="/" /> : children;
};

export default RequireGuest;
