import {useState, useEffect} from "react";

import {getPosts} from "../services/firebase";

export default function usePosts(user: any) {
  const [posts, setPosts] = useState<any>(null);

  useEffect(() => {
    async function getTimelinePosts() {
      if (user?.following?.length > 0) {
        const followedUserPosts = await getPosts(user.userId, user.following);
        followedUserPosts.sort((a, b) => b.dateCreated - a.dateCreated);
        setPosts(followedUserPosts);
      }
    }

    getTimelinePosts();
  }, [user?.userId, user?.following]);

  return {posts};
}
