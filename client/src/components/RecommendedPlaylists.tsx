import "../App.css";
const playlists: Readonly<Array<Record<string, any>>> = [
  {
    name: "500 best albums of all time",
    url: "https://open.spotify.com/playlist/4KmcBdDIbHeO0alvCfk2TC",
    image:
      "https://mosaic.scdn.co/300/ab67616d0000b273b36949bee43217351961ffbcab67616d0000b273c8b444df094279e70d0ed856ab67616d0000b273dc30583ba717007b00cceb25ab67616d0000b273ea7caaff71dea1051d49b2fe",
  },
  {
    name: "Rap that fuels my god complex",
    url: "https://open.spotify.com/playlist/2muu3MIUmNVmy08BvSixai",
    image: "https://i.scdn.co/image/ab67706c0000bebb07a96b248c887883fe51ec3c",
  },
  {
    name: "bad trip: uno reverse card",
    url: "https://open.spotify.com/playlist/4GMdRhABd6AFPQ3hY5yjnX",
    image: "https://i.scdn.co/image/ab67706c0000bebb2f2995d71ee62f8adf04d075",
  },
];

const RecommendedPlaylists = () => {
  return (
    <div className="Recommended-Playlist-Grid-Container">
      {playlists.map((playlist, index) => (
        <div className="Recommended-Playlist-Card" key={index}>
          <h2>{playlist.name}</h2>
          <img src={playlist.image} width={150} alt={playlist.name} />
          <button onClick={() => window.open(`${playlist.url}`)}>
            Go to playlist
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecommendedPlaylists;
