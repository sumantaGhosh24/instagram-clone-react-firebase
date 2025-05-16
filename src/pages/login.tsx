import {useState, useEffect, FormEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import * as ROUTES from "../constants/routes";
import {useFirebase} from "../firebase/auth-context";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const firebase = useFirebase();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (data.email === "" || data.password === "") {
        toast.error("Please fill in all fields.");
      } else {
        await firebase.signIn(data.email, data.password);
        toast.success("Login successful.");
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Login - Instagram";
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

          <form onSubmit={handleLogin} method="POST">
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
              className="text-sm text-gray-500 w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={(e) => setData({...data, password: e.target.value})}
              value={data.password}
            />
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-500 text-white w-full rounded h-8 font-bold cursor-pointer"
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Don't have an account?{` `}
            <Link to={ROUTES.SIGN_UP} className="font-bold text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
