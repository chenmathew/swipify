import axios from "axios";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { CreatePlaylist } from "../components/createplaylist";
import Nav from "../components/nav";
import { Songinfo } from "../components/songinfo";

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
            getNewTrack={getNewTrack}
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
