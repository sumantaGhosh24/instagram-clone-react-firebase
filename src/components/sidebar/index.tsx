import User from "./user";
import Suggestions from "./suggestions";
import {useFirebase} from "../../firebase/auth-context";

export default function Sidebar() {
  const {authUser} = useFirebase();

  return (
    <div className="p-4">
      <User
        username={authUser?.username}
        fullName={authUser?.fullName}
        imageUrl={authUser?.imageUrl}
      />
      <Suggestions
        userId={authUser?.userId}
        following={authUser?.following}
        loggedInUserDocId={authUser?.id as string}
      />
    </div>
  );
}
