import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";
import ReactAudioPlayer from "react-audio-player";
import Link from "next/link";

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
  return (
    <div>
      <Link href="/builder">Builder Mode</Link>
      <Link href="/explore">Explore Mode</Link>
    </div>
  );
};
export default Home;
