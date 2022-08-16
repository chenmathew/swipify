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
    <button
      className="w-full h-full absolute text-5xl"
      onClick={() => router.push("/explore")}
    >
      Click anywhere to enter site
      {/* <div>
        <Link href="/builder">Builder Mode</Link>
      </div> */}
    </button>
  );
};
export default Home;
