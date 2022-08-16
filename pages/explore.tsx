import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Songinfo from "../components/songinfo";
import { getNewTrack, getToken } from "../components/helpers/tokenhelpers";

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
  });
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    getToken(clientId, clientSecret).then(async (res) => {
      setToken(res);
      await getNewTrack(res, setTrack);
    });
  }, [clientId, clientSecret]);

  return (
    <div className="grid place-items-center h-screen border-2">
      <div className="fixed border-2 w-3/4">
        <div className="grid grid-cols-2">
          <Songinfo
            track={track}
            liked={liked}
            setLiked={setLiked}
            token={token}
            autoplay={autoplay}
            setAutoplay={setAutoplay}
            setTrack={setTrack}
          />
        </div>
      </div>
    </div>
  );
};
export default Home;
