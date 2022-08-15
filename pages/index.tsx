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
  - After the user sends to playlist, reset state
  - Implement a UI
  - Break down components so it's not messy
  - Fixed autoplay

Future:
  - Make background color change depending on album cover
  - Implement refresh until successful request
*/

const Home: NextPage = () => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  const [token, setToken] = useState("");
  const [track, setTrack] = useState({
    id: "",
    name: "",
    artist: "",
    album: "",
    link: "",
    prev: "",
    uri: "",
  });
  const [double, setDouble] = useState(false);
  const [liked, setLiked] = useState<any>({
    id: [],
    name: [],
    uri: [],
  });
  const [autoplay, setAutoplay] = useState(false);

  // const [loop, setLoop] = useState(true);

  const randomOffset = Math.floor(Math.random() * 1000);
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

  const getNewTrack = async (tok: any) => {
    await axios("https://api.spotify.com/v1/search", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + tok,
        "Content-Type": "application/json",
      },
      params: {
        q: getRandomSearch(),
        type: "track",
        offset: randomOffset,
      },
    }).then((res) => {
      console.log(res);
      if (res.data.tracks.items.length === 0) {
        getNewTrack(tok);
      } else {
        const item = res.data.tracks.items[randomTrack];
        console.log(item);
        let str = "";
        const artistArr = item.artists;
        artistArr.map((artist: any, index: number) => {
          if (index < item.artists.length - 1) str += `${artist.name}, `;
          else str += artist.name;
        });
        setTrack({
          id: item.id,
          name: item.name,
          artist: str,
          album: item.album.images[0].url,
          link: item.external_urls.spotify,
          prev: item.preview_url,
          uri: item.uri,
        });
      }
      // setLoop(false);
    });
  };
  console.log(track.name, track.prev);

  useEffect(() => {
    getToken().then(async (res) => {
      await getNewTrack(res);
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
      id: [...liked.id, track.id],
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
    const ids = liked.id.map((id: string) => id);
    return (
      <div>
        <div>
          {liked.name.map((name: string, i: number) => (
            <div key={ids[i]}>{name}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {track.album != "" ? (
        <div>
          <div>
            {autoplay ? (
              <button onClick={() => setAutoplay(false)}>
                Turn off autoplay
              </button>
            ) : (
              <button onClick={() => setAutoplay(true)}>
                Turn on autoplay
              </button>
            )}
          </div>
          <Image src={track.album} height="128" width="128" />
          <div>{track.artist}</div>
          <div>{track.name}</div>{" "}
          {track.prev != null ? (
            <ReactAudioPlayer src={track.prev} autoPlay={autoplay} controls />
          ) : (
            <div>There is no preview for this song</div>
          )}
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
        <div>Failed to load for some reason (Try refreshing page)</div>
      )}
    </div>
  );
};
export default Home;
