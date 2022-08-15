// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};
const client_id: any = process.env.NEXT_PUBLIC_CLIENT_ID; // Your client id
const client_secret: any = process.env.NEXT_PUBLIC_CLIENT_SECRET; // Your secret

const options = {
  url: "https://accounts.spotify.com/api/token",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${Buffer.from(
      `${client_id}:${client_secret}`,
      "utf-8"
    ).toString("base64")}`,
  },
  params: {
    grant_type: "refresh_token",
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    return new Promise<void>((resolve, reject) => {
      axios(options)
        .then((resp) => {
          res.end(JSON.stringify(resp.data.access_token));
          resolve();
        })
        .catch(async (err) => {
          console.log("ERR GETTING SPOTIFY ACCESS TOKEN", err);
          res.end(null);
          resolve();
        });
    });
  } else {
    return;
  }
}
