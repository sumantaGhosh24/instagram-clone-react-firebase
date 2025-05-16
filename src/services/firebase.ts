import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import {db} from "../firebase/firebase";

export async function doesUsernameExist(username: string) {
  const q = query(
    collection(db, "users"),
    where("username", "==", username.toLowerCase())
  );
  const result = await getDocs(q);
  return result.docs.length > 0;
}

export async function getUserByUsername(username: string) {
  const q = query(
    collection(db, "users"),
    where("username", "==", username.toLowerCase())
  );
  const result = await getDocs(q);
  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

export async function getUserByUserId(userId: string) {
  const q = query(collection(db, "users"), where("userId", "==", userId));
  const result = await getDocs(q);
  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

export async function getSuggestedProfiles(
  userId: string,
  following: string[]
) {
  let q;
  if (following.length > 0) {
    q = query(
      collection(db, "users"),
      where("userId", "not-in", [...following, userId]),
      limit(10)
    );
  } else {
    q = query(
      collection(db, "users"),
      where("userId", "!=", userId),
      limit(10)
    );
  }

  const result = await getDocs(q);
  return result.docs.map((user) => ({
    ...user.data(),
    docId: user.id,
  }));
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId: string,
  profileId: string,
  isFollowingProfile: boolean
) {
  const userRef = doc(db, "users", loggedInUserDocId);
  await updateDoc(userRef, {
    following: isFollowingProfile
      ? arrayRemove(profileId)
      : arrayUnion(profileId),
  });
}

export async function updateFollowedUserFollowers(
  profileDocId: string,
  loggedInUserDocId: string,
  isFollowingProfile: boolean
) {
  const profileRef = doc(db, "users", profileDocId);
  await updateDoc(profileRef, {
    followers: isFollowingProfile
      ? arrayRemove(loggedInUserDocId)
      : arrayUnion(loggedInUserDocId),
  });
}

export async function getPosts(userId: string, following: string[]) {
  const q = query(collection(db, "posts"), where("userId", "in", following));
  const result = await getDocs(q);
  const userFollowedPosts = result.docs.map((post) => ({
    ...post.data(),
    docId: post.id,
  }));

  const postWithUserDetails = await Promise.all(
    userFollowedPosts.map(async (post: any) => {
      const userLikedPost = post.likes.includes(userId);
      const user = await getUserByUserId(post.userId);
      // @ts-ignore
      const {username, imageUrl} = user[0];
      return {username, imageUrl, ...post, userLikedPost};
    })
  );

  return postWithUserDetails;
}

export async function getUserPostsByUserId(userId: string) {
  const q = query(collection(db, "posts"), where("userId", "==", userId));
  const result = await getDocs(q);
  return result.docs.map((post) => ({
    ...post.data(),
    docId: post.id,
  }));
}

export async function isUserFollowingProfile(
  loggedInUserUsername: string,
  profileUserId: string
) {
  const q = query(
    collection(db, "users"),
    where("username", "==", loggedInUserUsername),
    where("following", "array-contains", profileUserId)
  );
  const result = await getDocs(q);
  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return (response as any).userId;
}

export async function toggleFollow(
  isFollowingProfile: boolean,
  activeUserDocId: string,
  profileDocId: string,
  profileUserId: string,
  followingUserId: string
) {
  await updateLoggedInUserFollowing(
    activeUserDocId,
    profileUserId,
    isFollowingProfile
  );

  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
}
