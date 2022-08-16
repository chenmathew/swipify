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

  // const [loop, setLoop] = useState(true);

  // const getNewTrack = async (tok: any) => {
  //   await axios("https://api.spotify.com/v1/search", {
  //     method: "GET",
  //     headers: {
  //       Authorization: "Bearer " + tok,
  //       "Content-Type": "application/json",
  //     },
  //     params: {
  //       q: getRandomSearch(),
  //       type: "track",
  //       offset: randomOffset,
  //     },
  //   }).then(async (res) => {
  //     if (res.data.tracks.items.length === 0) {
  //       return await getNewTrack(tok);
  //     } else {
  //       const item = res.data.tracks.items[randomTrack];
  //       let str = "";
  //       const artistArr = item.artists;
  //       artistArr.map((artist: any, index: number) => {
  //         if (index < item.artists.length - 1) str += `${artist.name}, `;
  //         else str += artist.name;
  //       });
  //       setTrack({
  //         name: item.name,
  //         artist: str,
  //         album: item.album.images[0].url,
  //         link: item.external_urls.spotify,
  //         prev: item.preview_url,
  //         uri: item.uri,
  //       });
  //     }
  //     // setLoop(false);
  //   });
  // };

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

  return (
    // <div className="border-2 h-screen flex">
    <div className="grid place-items-center h-screen border-2">
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
  );
};
export default Home;
