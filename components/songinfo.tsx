import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SongPreview from "./songpreview";

interface songinfoProps {
  setLiked: any;
  liked: any;
  track: any;
  token: string;
  autoplay: boolean;
  setAutoplay: any;
}

export const Songinfo: React.FC<songinfoProps> = ({
  track,
  autoplay,
  setAutoplay,
}) => {
  return (
    <div>
      {track.name != "" ? (
        <div>
          <div>
            {/* {autoplay ? (
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
                Turn on autoplay
              </button>
            )} */}
          </div>
          <div className="lg:w-64 w-32">
            <div className="grid place-content-center text-center">
              <div className="grid place-content-center">
                <div className="lg:h-64 lg:w-64 relative grid w-32 h-32">
                  <Image src={track.album} layout="fill" priority />
                </div>
              </div>
              <div className="grid grid-flow-row mt-2">
                <div className="lg:max-w-64 overflow-scroll whitespace-nowrap">
                  {track.artist}
                </div>
                <div className="max-w-32 max-h-32 lg:max-w-64 overflow-scroll whitespace-nowrap">
                  {track.name}
                </div>
              </div>
              {track.prev != null ? (
                <div>
                  <SongPreview preview={track.prev} autoplay={autoplay} />
                </div>
              ) : (
                <div className="overflow-scroll whitespace-nowrap">
                  There is no preview for this song
                </div>
              )}
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
