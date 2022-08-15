import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";
import ReactAudioPlayer from "react-audio-player";
import Songinfo from "../components/songinfo";

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
  const redirectUri = "http://localhost:3000";
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
      if (res.data.tracks.items.length === 0) {
        return getNewTrack(tok);
      } else {
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
      }
      // setLoop(false);
    });
  };

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
  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    if (liked.name.length === 0) {
      console.log("error making playlist");
      return;
    }

    // Get data from the form.
    const data = {
      name: event.target.pname.value,
      description: event.target.desc.value,
      public: event.target.type.value,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);
    await axios
      .post(`https://api.spotify.com/v1/users/${userID}/playlists`, JSONdata, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      })
      .then(async (res) => {
        let str = "";
        liked.uri.forEach((item: string) => {
          str += item;
          if (liked.uri[liked.uri.length - 1] === item) return;
          else str += ",";
        });
        str = str.replaceAll(":", "%3A");
        str = str.replaceAll(",", "%2C");
        axios
          .post(
            `https://api.spotify.com/v1/playlists/${res.data.id}/tracks?uris=${str}`,
            null,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((_) => console.log("successfully added"))
          .catch((err) => console.error(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    // <div className="border-2 h-screen flex">
    <div>
      <Songinfo
        track={track}
        liked={liked}
        setLiked={setLiked}
        token={token}
        getNewTrack={getNewTrack}
      />
      {userToken ? (
        <div>
          <div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="pname"></label>
              <input
                type="text"
                id="pname"
                name="pname"
                placeholder="Playlist Name"
                required
              />
              <label htmlFor="desc"></label>
              <input
                type="text"
                id="desc"
                name="desc"
                placeholder="Description"
                required
              />
              <input
                type="radio"
                id="public"
                name="type"
                value="true"
                defaultChecked
                required
              />
              <label htmlFor="html">Public</label>
              <input
                type="radio"
                id="private"
                name="type"
                value="false"
                required
              />
              <label htmlFor="css">Private</label>
              <button type="submit">Create playlist</button>
            </form>
          </div>
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
