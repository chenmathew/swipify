import axios from "axios";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { CreatePlaylist } from "../components/createplaylist";
import { Songinfo } from "../components/songinfo";
import { getNewTrack, getToken } from "../components/helpers/tokenhelpers";
import { LikeDislike } from "../components/likedislike";
import { LikedMusic } from "../components/likedmusic";
import { useRouter } from "next/router";
import Footer from "../components/footer";

const Home: NextPage = () => {
  const redirectUri = `https://swipify.vercel.app/builder`;
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const scope = "playlist-modify-public playlist-modify-private";
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  const [token, setToken] = useState("");
  const [track, setTrack] = useState({
    name: "",
    artist: "",
    album: "",
    link: "",
    prev: "",
    uri: "",
  });
  const [liked, setLiked] = useState<any>({
    name: [],
    uri: [],
    preview: [],
    artist: [],
  });
  const [userToken, setUserToken] = useState("");
  const [userID, setUserID] = useState("");
  const [autoplay, setAutoplay] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getToken(clientId, clientSecret).then(async (res) => {
      setToken(res);
      await getNewTrack(res, setTrack);
    });
  }, [clientId, clientSecret]);

  useEffect(() => {
    const hash: any = window.location.hash;
    let t: any = window.localStorage.getItem("token");

    if (!t && hash) {
      t = hash
        .substring(1)
        .split("&")
        .find((elem: string) => elem.startsWith("access_token"))
        .split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", t);
    }
    setUserToken(t);
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setUserID(res.data.id);
      });
  }, []);

  const logout = () => {
    setUserToken("");
    window.localStorage.removeItem("token");
    router.push("/");
  };

  return (
    // <div className="border-2 h-screen flex">
    <div>
      {userID ? (
        <div>
          <div className="grid place-items-center h-screen">
            <div className="fixed w-3/4 h-full max-h-96">
              <div className="grid grid-cols-2">
                <div className="grid place-content-center">
                  <Songinfo
                    track={track}
                    liked={liked}
                    setLiked={setLiked}
                    token={token}
                    autoplay={autoplay}
                    setAutoplay={setAutoplay}
                  />
                  <LikeDislike
                    setLiked={setLiked}
                    liked={liked}
                    track={track}
                    token={token}
                    setTrack={setTrack}
                  />
                  <CreatePlaylist
                    userToken={userToken}
                    liked={liked}
                    userID={userID}
                  />
                  <span>
                    <button onClick={logout} className="hover:text-red-300">
                      Logout
                    </button>
                  </span>
                </div>
                <div className="grid h-96 overflow-scroll no-scrollbar">
                  <LikedMusic
                    track={track}
                    token={token}
                    liked={liked}
                    setLiked={setLiked}
                    autoplay={autoplay}
                    setTrack={setTrack}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid place-content-center h-screen">
          <a
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`}
            className="text-6xl hover:text-red-300"
          >
            Click here to log in to Spotify
          </a>
        </div>
      )}
      <Footer />
    </div>
  );
};
export default Home;
