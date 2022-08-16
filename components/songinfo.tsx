import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LikedMusic } from "./likedmusic";
import SongPreview from "./songpreview";

interface songinfoProps {
  setLiked: any;
  liked: any;
  track: any;
  token: string;
  autoplay: boolean;
  setAutoplay: any;
  setTrack: any;
}

export const Songinfo: React.FC<songinfoProps> = ({
  track,
  token,
  liked,
  setLiked,
  autoplay,
  setAutoplay,
  setTrack,
}) => {
  return (
    <div>
      {track.name != "" ? (
        <div>
          <div>
            {autoplay ? (
              <button
                onClick={() => {
                  setAutoplay(false);
                }}
              >
                Turn off autoplay
              </button>
            ) : (
              <button
                onClick={() => {
                  setAutoplay(true);
                }}
              >
                Turn on autoplay {autoplay}
              </button>
            )}
          </div>
          <div className="border-2">
            <div className="grid border-2 place-content-center text-center">
              <div className="h-64 w-64 relative grid">
                <Image src={track.album} layout="fill" priority />
              </div>
              <div>{track.artist}</div>
              <div>{track.name}</div>
              {track.prev != null ? (
                <div>
                  <SongPreview preview={track.prev} />
                </div>
              ) : (
                <div>There is no preview for this song</div>
              )}
            </div>
            <div>
              <LikedMusic
                track={track}
                token={token}
                liked={liked}
                setLiked={setLiked}
                autoplay={autoplay}
                setTrack={setTrack}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>Failed to load for some reason (Try refreshing page)</div>
      )}
    </div>
  );
};

export default Songinfo;
