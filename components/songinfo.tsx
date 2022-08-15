import React, { useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import Image from "next/image";
import { LikedMusic } from "./likedmusic";

interface songinfoProps {
  setLiked: any;
  liked: any;
  track: any;
  getNewTrack: any;
  token: string;
}

export const Songinfo: React.FC<songinfoProps> = ({
  track,
  token,
  getNewTrack,
  liked,
  setLiked,
}) => {
  const [autoplay, setAutoplay] = useState(false);
  return (
    <div>
      {track.name != "" ? (
        <div className="m-auto">
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
          <div>{track.name}</div>
          {track.prev != null ? (
            <ReactAudioPlayer src={track.prev} autoPlay={autoplay} controls />
          ) : (
            <div>There is no preview for this song</div>
          )}
          <LikedMusic
            track={track}
            token={token}
            getNewTrack={getNewTrack}
            liked={liked}
            setLiked={setLiked}
          />
        </div>
      ) : (
        <div>Failed to load for some reason (Try refreshing page)</div>
      )}
    </div>
  );
};

export default Songinfo;
