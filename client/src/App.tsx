import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Navbar } from "./components";
import "./App.css";

const App = () => {
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      console.log(code);
      const tokens = await axios.post("http://localhost:3001/auth/google", {
        code,
      });
    },
    onError: async (err) => {
      console.log(err);
    },
    flow: "auth-code",
  });
  return (
    <>
      <Navbar />
      <button
        className="bg-gray-900 text-white"
        onClick={() => googleLogin()}
      >
        Sign in with Google 🤞
      </button>
    </>
  );
};

export default App;
