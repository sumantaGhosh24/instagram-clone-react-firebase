import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import {FirebaseProvider} from "./firebase/auth-context";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FirebaseProvider>
      <App />
      <ToastContainer />
    </FirebaseProvider>
  </StrictMode>
);
