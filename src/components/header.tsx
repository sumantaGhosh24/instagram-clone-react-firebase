import {Link, useNavigate} from "react-router-dom";
import {Home, LogOut} from "lucide-react";

import * as ROUTES from "../constants/routes";
import {DEFAULT_IMAGE_PATH} from "../constants/paths";
import {useFirebase} from "../firebase/auth-context";
import AddPost from "./add-post";
import UpdateProfile from "./update-profile";

export default function Header() {
  const firebase = useFirebase();

  const navigate = useNavigate();

  return (
    <header className="h-16 bg-gray-200 border-b border-gray-700 mb-8 text-white">
      <div className="container mx-auto h-full">
        <div className="flex justify-between h-full">
          <div className="text-gray-700 text-center flex items-center align-items cursor-pointer">
            <h1 className="flex justify-center w-full">
              <Link to={ROUTES.DASHBOARD} aria-label="Instagram logo">
                <img
                  src="/images/logo.png"
                  alt="Instagram"
                  className="mt-2 w-6/12"
                />
              </Link>
            </h1>
          </div>
          <div className="text-gray-700 text-center flex items-center align-items">
            {firebase.authUser ? (
              <>
                <Link to={ROUTES.DASHBOARD} aria-label="Dashboard">
                  <Home
                    size={30}
                    className="text-gray-500 mr-6 cursor-pointer"
                  />
                </Link>
                <AddPost />
                <UpdateProfile />
                {firebase?.authUser && (
                  <div className="flex items-center cursor-pointer">
                    <Link to={`/p/${firebase?.authUser?.username}`}>
                      <img
                        className="rounded-full h-8 w-8 flex"
                        src={
                          firebase.authUser?.imageUrl ??
                          "/images/avatars/default.jpg"
                        }
                        alt={`${firebase?.authUser?.username} profile`}
                        onError={(e: any) => {
                          e.target.src = DEFAULT_IMAGE_PATH;
                        }}
                      />
                    </Link>
                  </div>
                )}
                <button
                  type="button"
                  title="Sign Out"
                  onClick={async () => {
                    await firebase.handleLogout();
                    navigate(ROUTES.LOGIN);
                  }}
                  onKeyDown={async (event) => {
                    if (event.key === "Enter") {
                      await firebase.handleLogout();
                      navigate(ROUTES.LOGIN);
                    }
                  }}
                >
                  <LogOut
                    size={30}
                    className="text-gray-500 ml-6 cursor-pointer"
                  />
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <button
                    type="button"
                    className="bg-blue-500 font-bold text-sm rounded text-white w-20 h-8 cursor-pointer"
                  >
                    Log In
                  </button>
                </Link>
                <Link to={ROUTES.SIGN_UP}>
                  <button
                    type="button"
                    className="font-bold text-sm rounded text-blue-500 w-20 h-8 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
