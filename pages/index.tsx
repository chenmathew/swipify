import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

const Home: NextPage = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    axios
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
      .then((res) => console.log(res));
  }, []);

  return <div>lol</div>;
};

export default Home;
