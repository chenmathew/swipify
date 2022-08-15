import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";
import ReactAudioPlayer from "react-audio-player";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Link href="/builder">Builder Mode</Link>
      <Link href="/explore">Explore Mode</Link>
    </div>
  );
};
export default Home;
