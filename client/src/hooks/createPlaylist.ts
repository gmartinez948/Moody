// const createPlaylistId = async () => {
//   const data = {
//     playlistName,
//     user_id: userId,
//   };
//   try {
//     await axios
//       .post("http://localhost:80/create_playlist_id", data)
//       .then((result) => setPlaylistToken(result.data.id))
//       .catch((error) => console.log(error));
//   } catch (error) {
//     console.log(error, "error here");
//   }
// };

// const createPlaylist = async () => {
//   try {
//     const data: Record<string, any> = {
//       playlist_id: playlistToken,
//       uris: tracks,
//     };
//     await axios
//       .post("http://localhost:80/create_playlist", data)
//       .then((result) => console.log(result, "result"))
//       .catch((error) => console.log(error, "error"));
//   } catch (error) {
//     console.log(error);
//   }
// };
