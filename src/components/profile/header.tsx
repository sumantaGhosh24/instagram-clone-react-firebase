import {useState, useEffect} from "react";
import Skeleton from "react-loading-skeleton";

import {isUserFollowingProfile, toggleFollow} from "../../services/firebase";
import {DEFAULT_IMAGE_PATH} from "../../constants/paths";
import {useFirebase} from "../../firebase/auth-context";

interface HeaderProps {
  postsCount: number;
  followerCount: number;
  setFollowerCount: any;
  profile: {
    docId: string;
    userId: string;
    fullName: string;
    username: string;
    followers: string[];
    following: string[];
    imageUrl?: string;
  };
}

export default function Header({
  postsCount,
  followerCount,
  setFollowerCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers,
    following,
    username: profileUsername,
    imageUrl,
  },
}: HeaderProps) {
  const [isFollowingProfile, setIsFollowingProfile] = useState<boolean | null>(
    null
  );

  const firebase = useFirebase();

  const activeBtnFollow =
    firebase.authUser?.username &&
    firebase.authUser?.username !== profileUsername;

  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1,
    });
    if (!firebase.authUser) return;
    await toggleFollow(
      isFollowingProfile as boolean,
      firebase!.authUser!.id,
      profileDocId,
      profileUserId,
      firebase.authUser?.userId
    );
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      if (!firebase.authUser) return;
      const isFollowing = await isUserFollowingProfile(
        firebase.authUser?.username,
        profileUserId
      );
      setIsFollowingProfile(!!isFollowing);
    };

    if (firebase.authUser?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [firebase.authUser?.username, profileUserId]);

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center items-center">
        {profileUsername ? (
          <img
            className="rounded-full h-40 w-40 flex"
            alt={`${fullName} profile picture`}
            src={imageUrl ?? "/images/avatars/default.jpg"}
            onError={(e: any) => {
              e.target.src = DEFAULT_IMAGE_PATH;
            }}
          />
        ) : (
          <Skeleton circle height={150} width={150} count={1} />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{profileUsername}</p>
          {activeBtnFollow && isFollowingProfile === null ? (
            <Skeleton count={1} width={80} height={32} />
          ) : (
            activeBtnFollow && (
              <button
                className="bg-blue-500 font-bold text-sm rounded text-white w-20 h-8 cursor-pointer"
                type="button"
                onClick={handleToggleFollow}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleFollow();
                  }
                }}
              >
                {isFollowingProfile ? "Unfollow" : "Follow"}
              </button>
            )
          )}
        </div>
        <div className="container flex mt-4">
          {!followers || !following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-bold">{postsCount}</span> posts
              </p>
              <p className="mr-10">
                <span className="font-bold">{followerCount}</span>
                {` `}
                {followerCount === 1 ? `follower` : `followers`}
              </p>
              <p className="mr-10">
                <span className="font-bold">{following?.length}</span> following
              </p>
            </>
          )}
        </div>
        <div className="container mt-4">
          <p className="font-medium">
            {!fullName ? <Skeleton count={1} height={24} /> : fullName}
          </p>
        </div>
      </div>
    </div>
  );
}
