const LandingPage = () => {
  const signInSpotify = () => {
    window.location.replace("http://localhost:80/login");
  };

  return (
    <>
      <button onClick={() => signInSpotify()}>Log in to Spotify</button>
    </>
  );
};

export default LandingPage;
