import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Songinfo from "../components/songinfo";
import { getNewTrack, getToken } from "../components/helpers/tokenhelpers";
import { LikedMusic } from "../components/likedmusic";
import { LikeDislike } from "../components/likedislike";

const Home: NextPage = () => {
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
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    getToken(clientId, clientSecret).then(async (res) => {
      setToken(res);
      await getNewTrack(res, setTrack);
    });
  }, [clientId, clientSecret]);

  return (
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
          </div>
          <div className="grid h-96 overflow-scroll">
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
  );
};
export default Home;
