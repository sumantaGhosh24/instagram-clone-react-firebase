import {Navigate} from "react-router-dom";

import {useFirebase} from "../firebase/auth-context";

interface RequireAuthProps {
  children: any;
}

const RequireAuth = ({children}: RequireAuthProps) => {
  const firebase = useFirebase();

  return firebase.authUser ? children : <Navigate to="/login" />;
};

export default RequireAuth;
