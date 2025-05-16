import {lazy, Suspense} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from "./components/header";

import ReactLoader from "./components/loader";
import RequireAuth from "./components/require-auth";
import RequireGuest from "./components/require-guest";
import * as ROUTES from "./constants/routes";

const Login = lazy(() => import("./pages/login"));
const SignUp = lazy(() => import("./pages/sign-up"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Profile = lazy(() => import("./pages/profile"));
const NotFound = lazy(() => import("./pages/not-found"));

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<ReactLoader />}>
        <Routes>
          <Route
            path={ROUTES.LOGIN}
            element={
              <RequireGuest>
                <Login />
              </RequireGuest>
            }
          />
          <Route
            path={ROUTES.SIGN_UP}
            element={
              <RequireGuest>
                <SignUp />
              </RequireGuest>
            }
          />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
