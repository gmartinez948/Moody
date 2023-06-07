import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";

function App() {
  const [login, setLogin] = useState(false);
  useEffect(() => {
    try {
      axios({
        method: "get",
        url: "http://localhost:80/login",
      })
        .then((response) => {
          console.log(response, "response");
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <Navbar />
    </div>
  );
}

export default App;
