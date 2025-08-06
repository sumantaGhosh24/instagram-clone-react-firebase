import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {useState, useEffect, type FormEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import * as ROUTES from "../constants/routes";
import {useFirebase} from "../firebase/auth-context";
import {db} from "../firebase/firebase";
import {doesUsernameExist} from "../services/firebase";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const firebase = useFirebase();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (
        data.username === "" ||
        data.fullname === "" ||
        data.email === "" ||
        data.password === ""
      ) {
        toast.error("Please fill in all fields.");
      } else {
        const usernameExists = await doesUsernameExist(data.username);
        if (!usernameExists) {
          const res: any = await firebase.signUp(data.email, data.password);

          const obj = {
            userId: res.user.uid,
            username: data.username.toLowerCase(),
            fullName: data.fullname,
            emailAddress: data.email.toLowerCase(),
            following: [],
            followers: [],
            dateCreated: Date.now(),
          };

          await setDoc(doc(db, "users", res.user.uid), {
            ...obj,
            timestamp: serverTimestamp(),
          });

          toast.success("Sign Up successful.");

          navigate(ROUTES.DASHBOARD);
        } else {
          toast.error("That username is already taken, please try another.");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Sign Up - Instagram";
  }, []);

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex flex-col w-[70%] mx-auto">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img
              src="/images/logo.png"
              alt="Instagram"
              className="mt-2 w-6/12 mb-4"
            />
          </h1>
          <form onSubmit={handleSignUp} method="POST">
            <input
              aria-label="Enter your username"
              type="text"
              placeholder="Username"
              className="text-sm text-gray-500 w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={(e) => setData({...data, username: e.target.value})}
              value={data.username}
            />
            <input
              aria-label="Enter your full name"
              type="text"
              placeholder="Full name"
              className="text-sm text-gray-500 w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={(e) => setData({...data, fullname: e.target.value})}
              value={data.fullname}
            />
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email address"
              className="text-sm text-gray-500 w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={(e) => setData({...data, email: e.target.value})}
              value={data.email}
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={(e) => setData({...data, password: e.target.value})}
              value={data.password}
            />
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-500 text-white w-full rounded h-8 font-bold cursor-pointer"
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Have an account?{` `}
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
