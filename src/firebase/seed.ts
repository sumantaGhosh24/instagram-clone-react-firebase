import {createUserWithEmailAndPassword} from "firebase/auth";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {faker} from "@faker-js/faker";
import {v4 as uuidv4} from "uuid";

import {auth, db} from "./firebase";

export const seedDB = async () => {
  try {
    console.log("Database seeding started...");

    console.log("Seeding users...");
    const users = [];
    for (let i = 0; i < 10; i++) {
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      const email = faker.internet.email({firstName, lastName}).toLowerCase();

      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        `${firstName}${lastName}`
      );

      await setDoc(doc(db, "users", res.user.uid), {
        userId: res.user.uid,
        username: faker.internet.username({firstName, lastName}),
        fullName: firstName + lastName,
        emailAddress: email,
        imageUrl:
          "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        following: [],
        followers: [],
        dateCreated: Date.now(),
        timestamp: serverTimestamp(),
      });
      users.push(res.user.uid);
    }
    console.log("Seeded users.");

    console.log("Seeding posts...");
    for (let i = 0; i < 10; i++) {
      const randomUser = faker.helpers.arrayElement(users);
      const postId = uuidv4();

      await setDoc(doc(db, "posts", postId), {
        userId: randomUser,
        imageSrc:
          "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        caption: faker.lorem.paragraph(),
        likes: [],
        comments: [],
        dateCreate: Date.now(),
        timestamp: serverTimestamp(),
      });
    }
    console.log("Seeded posts.");

    console.log("Database seeding complete!");
  } catch (error) {
    console.log(error);
  }
};
