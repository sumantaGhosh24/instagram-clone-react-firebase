import Skeleton from "react-loading-skeleton";

import {useFirebase} from "../firebase/auth-context";
import usePosts from "../hooks/use-posts";
import Post from "./post";

export default function Timeline() {
  const {authUser: user} = useFirebase();

  const {posts} = usePosts(user);

  return (
    <div className="col-span-2">
      {user?.following === undefined ? (
        <Skeleton count={2} width={640} height={500} className="mb-5" />
      ) : user?.following.length === 0 ? (
        <p className="flex justify-center font-bold">
          Follow other people to see Posts
        </p>
      ) : posts ? (
        posts.map((content: any) => (
          <Post key={content.docId} content={content} />
        ))
      ) : null}
    </div>
  );
}
