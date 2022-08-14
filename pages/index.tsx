import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";
import ReactAudioPlayer from "react-audio-player";

/*
Finished:
  Getting random track, getting like and storing

TO DO:
  IMPORTANT!
  - Add IDs to track object
    - This is so if there is a dupe in liked and current track, ignore, and can be used to set key
  - Make a post request to create a playlist https://developer.spotify.com/console/post-playlists/
    - Then add the tracks using the liked.uri https://developer.spotify.com/console/post-playlist-tracks/
  Not so important
  - Implement a UI
  - Break down components so it's not messy

Future:
  - Make background color change depending on album cover
  - Implement refresh until successful request
*/

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
  const [double, setDouble] = useState(false);
  const [liked, setLiked] = useState<any>({
    name: [],
    uri: [],
  });
  const [autoplay, setAutoplay] = useState(false);

  // const [loop, setLoop] = useState(true);

  const randomOffset = Math.floor(Math.random() * 700);
  const randomTrack = Math.floor(Math.random() * 20);

  //Code taken from https://perryjanssen.medium.com/getting-random-tracks-using-the-spotify-api-61889b0c0c27
  function getRandomSearch() {
    // A list of all characters that can be chosen.
    const characters = "abcdefghijklmnopqrstuvwxyz";

    // Gets a random character from the characters string.
    const randomCharacter = characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
    let randomSearch = "";

    // Places the wildcard character at the beginning, or both beginning and end, randomly.
    switch (Math.round(Math.random())) {
      case 0:
        randomSearch = randomCharacter + "%";
        break;
      case 1:
        randomSearch = "%" + randomCharacter + "%";
        break;
    }

    return randomSearch;
  }

  const getToken = async () =>
    await axios
      .post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${clientId}:${clientSecret}`,
              "utf-8"
            ).toString("base64")}`,
          },
        }
      )
      .then((res) => {
        setToken(res.data.access_token);
        return res.data.access_token;
      });
  const getNewTrack = async (res: any) => {
    await axios("https://api.spotify.com/v1/search", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + res,
        "Content-Type": "application/json",
      },
      params: {
        q: getRandomSearch(),
        type: "track",
        offset: randomOffset,
      },
    }).then((res) => {
      const item = res.data.tracks.items[randomTrack];
      let str = "";
      const artistArr = item.artists;
      artistArr.map((artist: any, index: number) => {
        if (index < item.artists.length - 1) str += `${artist.name}, `;
        else str += artist.name;
      });
      setTrack({
        name: item.name,
        artist: str,
        album: item.album.images[0].url,
        link: item.external_urls.spotify,
        prev: item.preview_url,
        uri: item.uri,
      });
      // setLoop(false);
    });
  };

  useEffect(() => {
    getToken().then((res) => {
      getNewTrack(res);
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

  const like = async () => {
    setDouble(true);
    setLiked({
      name: [...liked.name, track.name],
      uri: [...liked.uri, track.uri],
    });
    await getNewTrack(token);

    // Try to force to rerender
    // .catch(async () => {
    //   console.log("works");
    //   while (loop === true) getNewTrack(token);
    //   setLoop(true);
    // });
    setDouble(false);
  };
  const dislike = async () => {
    setDouble(true);
    await getNewTrack(token);
    setDouble(false);
  };

  const updateLiked = () => {
    return (
      <div>
        {liked.name.map((item: string) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    );
  };
  return (
    <div>
      {autoplay ? (
        <button onClick={() => setAutoplay(false)}>Turn off autoplay</button>
      ) : (
        <button onClick={() => setAutoplay(true)}>Turn on autoplay</button>
      )}
      {track.album != "" ? (
        <div>
          <Image src={track.album} height="128" width="128" />
          <div>{track.artist}</div>
          <div>{track.name}</div>
          <ReactAudioPlayer src={track.prev} autoPlay={autoplay} controls />
          <div>
            <button disabled={double} onClick={like} value={track.name}>
              Like
            </button>
          </div>
          <button disabled={double} onClick={dislike}>
            Dislike
          </button>
          <div>{updateLiked()}</div>
        </div>
      ) : (
        <div>Failed to load for some reason</div>
      )}
    </div>
  );
};
export default Home;
