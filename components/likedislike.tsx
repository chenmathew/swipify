import React, { useState } from "react";
import { getNewTrack } from "./helpers/tokenhelpers";
import Image from "next/image";
import { Down, Up } from "./helpers/svgs/svgs";

interface LikeDislike {
  setLiked: any;
  liked: any;
  track: any;
  token: string;
  setTrack: any;
}

export const LikeDislike: React.FC<LikeDislike> = ({
  setLiked,
  liked,
  track,
  token,
  setTrack,
}) => {
  const [double, setDouble] = useState(false);
  const [likeColor, setLikeColor] = useState<string>("#FFFFFF");
  const [dislikeColor, setdisLikeColor] = useState("#FFFFFF");

  const like = async () => {
    setDouble(true);
    setLiked({
      name: [...liked.name, track.name],
      uri: [...liked.uri, track.uri],
      preview: [...liked.preview, track.prev],
      artist: [...liked.artist, track.artist],
    });
    await getNewTrack(token, setTrack);
    setDouble(false);
  };
  const dislike = async () => {
    setDouble(true);
    await getNewTrack(token, setTrack);
    setDouble(false);
  };

  return (
    <div>
      <div className="grid place-content-center grid-cols-2">
        <span className="grid place-content-center">
          <button
            disabled={double}
            onClick={dislike}
            className="lg:h-24 lg:w-24 w-12 h-12"
            onMouseEnter={() => setdisLikeColor("#FAA0A0")}
            onMouseLeave={() => setdisLikeColor("#FFFFFF")}
          >
            <Down color={dislikeColor} />
          </button>
        </span>
        <span className="grid place-content-center">
          <button
            disabled={double}
            onClick={like}
            value={track.name}
            className="lg:h-24 lg:w-24 w-12 h-12"
            onMouseEnter={() => setLikeColor("#FAA0A0")}
            onMouseLeave={() => setLikeColor("#FFFFFF")}
          >
            <Up color={likeColor} />
          </button>
        </span>
      </div>
    </div>
  );
};
