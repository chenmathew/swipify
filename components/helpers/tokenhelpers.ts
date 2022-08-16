import axios from "axios";
import { getRandomSearch } from "./randhelper";

export const getToken = async (
  clientId: string | undefined,
  clientSecret: string | undefined
) =>
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
      return res.data.access_token;
    });

//  Chose to pass in setTrack because it works best for my design
export const getNewTrack = async (tok: any, setTrack: any) => {
  const randomOffset = Math.floor(Math.random() * 1000);
  const randomTrack = Math.floor(Math.random() * 20);
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
  }).then(async (res) => {
    if (res.data.tracks.items.length === 0) {
      return await getNewTrack(tok, setTrack);
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

// export const getNewTrack = async (tok: any) => {
//     const randomOffset = Math.floor(Math.random() * 1000);
//     const response = await axios("https://api.spotify.com/v1/search", {
//       method: "GET",
//       headers: {
//         Authorization: "Bearer " + tok,
//         "Content-Type": "application/json",
//       },
//       params: {
//         q: getRandomSearch(),
//         type: "track",
//         offset: randomOffset,
//       },
//     });
//     return response;
// };
