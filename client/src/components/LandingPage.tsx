import { motion, useAnimation } from "framer-motion";
import "../App.css";
import { useEffect } from "react";
const LandingPage = () => {
  const signInSpotify = () => {
    window.location.replace("http://localhost:80/login");
  };

  const controls = useAnimation();

  const getRandomColor = () => {
    const colors = [
      "#E6E6FA",
      "#ff7f00",
      "#ffff00",
      "#00ff00",
      "#0000ff",
      "#4b0082",
      "#8b00ff",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      controls.start({
        background: getRandomColor(),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [controls]);

  return (
    <div className="Landing-Page-Container">
      <div className="Landing-Page-Container Landing-Page-Content">
        <h1>Moody</h1>
        <p>
          Looking for music inspiration based on your mood? Let's get started!
        </p>
        <motion.button
          whileHover={{ scale: 1.1, transition: { duration: 0.5 } }}
          animate={controls}
          className="Landing-Page-Button"
          onClick={() => signInSpotify()}
        >
          Login to Spotify
        </motion.button>
      </div>
    </div>
  );
};

export default LandingPage;
