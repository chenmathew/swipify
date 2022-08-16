import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

/*
Finished:
  Getting random track, getting like and storing

TO DO:
  IMPORTANT!
  - Add IDs to track object
    - This is so if there is a dupe in liked and current track, ignore, and can be used to set key
  - Make a post request to create a playlist https://developer.spotify.com/console/post-playlists/
    - Then add the tracks using the liked.uri https://developer.spotify.com/console/post-playlist-tracks/
  - After the user sends to playlist, reset state
  - Implement a UI
  - Break down components so it's not messy
  - Fixed autoplay

Future:
  - Make background color change depending on album cover
  - Implement refresh until successful request
  - Explore mode - No login required
  - Login mode - login required
*/
const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div>
      <div className="grid grid-cols-2">
        <button
          onClick={() => router.push("/explore")}
          className="h-screen hover:text-red-300 hover:border-red-300 hover:border-2"
        >
          <div>Explorer Mode</div>
          <div>No need to login, but cannot save playlists</div>
        </button>
        <button
          className="h-screen hover:text-red-300 hover:border-red-300 hover:border-2"
          onClick={() => router.push("/builder")}
        >
          <div>Builder Mode</div>
          <div>No need to login, but cannot save playlists</div>
        </button>
      </div>
    </div>
  );
};
export default Home;
