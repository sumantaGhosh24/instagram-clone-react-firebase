import {useReducer, useEffect} from "react";

import Header from "./header";
import Posts from "./posts";
import {getUserPostsByUserId} from "../../services/firebase";

interface ProfileProps {
  user: {
    dateCreated: number;
    emailAddress: string;
    followers: string[];
    following: string[];
    fullName: string;
    userId: string;
    username: string;
  };
}

export default function Profile({user}: ProfileProps) {
  const reducer = (state: any, newState: any) => ({...state, ...newState});
  const initialState = {
    profile: {},
    postsCollection: null,
    followerCount: 0,
  };

  const [{profile, postsCollection, followerCount}, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function getProfileInfoAndPosts() {
      const posts = await getUserPostsByUserId(user.userId);
      dispatch({
        profile: user,
        postsCollection: posts,
        followerCount: user.followers.length,
      });
    }
    getProfileInfoAndPosts();
  }, [user.username]);

  return (
    <div>
      <Header
        postsCount={postsCollection ? postsCollection.length : 0}
        profile={profile}
        followerCount={followerCount}
        setFollowerCount={dispatch}
      />
      <hr className="mt-3" />
      <Posts posts={postsCollection} />
    </div>
  );
}
