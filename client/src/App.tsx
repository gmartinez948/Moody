import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";

const CLIENT_ID = process.env.CLIENT_ID;

function App() {
  const [login, setLogin] = useState(false);
  const [token, setToken] = useState("");

  const signInsSpotify = () => {
    window.location.replace("http://localhost:80/login");
  };

  return (
    <div>
      <button onClick={() => signInsSpotify()}>SIGN IN</button>
      <Navbar />
    </div>
  );
}

export default App;
