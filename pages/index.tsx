import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

/*
Finished:
  Getting random track, getting like and storing

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
          <div>Pick and like a random song</div>
        </button>
        <button
          className="h-screen hover:text-red-300 hover:border-red-300 hover:border-2"
          onClick={() => router.push("/builder")}
        >
          <div>Builder Mode</div>
          <div>Login to Spotify to add save tracks to playlist</div>
        </button>
      </div>
    </div>
  );
};
export default Home;
