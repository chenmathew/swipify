import axios from "axios";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { CreatePlaylist } from "../components/createplaylist";
import Nav from "../components/nav";
import { Songinfo } from "../components/songinfo";
import { getRandomSearch } from "../components/helpers/randhelper";
import { getNewTrack, getToken } from "../components/helpers/tokenhelpers";

const Home: NextPage = () => {
  const redirectUri = "http://localhost:3000/builder";
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
  });
  const [userToken, setUserToken] = useState("");
  const [userID, setUserID] = useState("");
  const [autoplay, setAutoplay] = useState(false);

  // const [loop, setLoop] = useState(true);

  useEffect(() => {
    getToken(clientId, clientSecret).then(async (res) => {
      setToken(res);
      await getNewTrack(res, setTrack);
    });

    // Trying to get this to keep rerendering
    //.catch(async () => {
    //     console.log("lol");
    //     while (loop === true) {
    //       setTimeout(async () => {
    //         if (loop === true) await getNewTrack(token);
    //       }),
    //         5000;
    //     }
    //   });
    //   setLoop(true);
    // });
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
  };

  return (
    // <div className="border-2 h-screen flex">
    <div>
      <Nav />
      {userToken ? (
        <div>
          <Songinfo
            track={track}
            liked={liked}
            setLiked={setLiked}
            token={token}
            autoplay={autoplay}
            setAutoplay={setAutoplay}
            setTrack={setTrack}
          />
          <div></div>
          <CreatePlaylist liked={liked} userID={userID} userToken={userToken} />
          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      ) : (
        <a
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`}
        >
          Login to Spotify to create playlist
        </a>
      )}
    </div>
  );
};
export default Home;
