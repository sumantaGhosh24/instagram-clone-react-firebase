import {useState} from "react";
import {Link} from "react-router-dom";

import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
} from "../../services/firebase";

interface SuggestedProfileProps {
  profileDocId: string;
  username: string;
  profileId: string;
  imageUrl?: string;
  userId: string;
  loggedInUserDocId: string;
}

export default function SuggestedProfile({
  profileDocId,
  username,
  profileId,
  imageUrl,
  userId,
  loggedInUserDocId,
}: SuggestedProfileProps) {
  const [followed, setFollowed] = useState(false);

  async function handleFollowUser() {
    setFollowed(true);
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
    await updateFollowedUserFollowers(profileDocId, userId, false);
  }

  return !followed ? (
    <div className="flex flex-row items-center align-items justify-between">
      <div className="flex items-center justify-between">
        <img
          className="rounded-full w-10 h-10 flex mr-3"
          src={imageUrl ?? "/images/avatars/default.jpg"}
          alt=""
          onError={(e: any) => {
            e.target.src = `/images/avatars/default.png`;
          }}
        />
        <Link to={`/p/${username}`}>
          <p className="font-bold text-sm">{username}</p>
        </Link>
      </div>
      <button
        className="text-xs font-bold text-blue-500 cursor-pointer"
        type="button"
        onClick={handleFollowUser}
      >
        Follow
      </button>
    </div>
  ) : null;
}
