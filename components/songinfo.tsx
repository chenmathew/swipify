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

export const Songinfo: React.FC<songinfoProps> = ({ track, autoplay }) => {
  return (
    <div>
      {track.name != "" ? (
        <div className="lg:grid-flow-row text-center grid-flow-col grid">
          {/* <div>
            { {autoplay ? (
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
            )} }
          </div> */}
          <div className="grid place-content-center text-center">
            <div className="grid place-content-center">
              <div className="lg:h-64 lg:w-64 relative grid w-40 h-40">
                <Image src={track.album} layout="fill" priority />
              </div>
            </div>
          </div>
          <div className="grid grid-flow-row lg:mt-2">
            <div className="max-w-32 max-h-32 lg:max-w-64 overflow-scroll whitespace-nowrap no-scrollbar">
              {track.artist}
            </div>
            <div className="max-w-32 max-h-32 lg:max-w-64 overflow-scroll whitespace-nowrap no-scrollbar">
              <a
                href={track.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-300"
              >
                {track.name}
              </a>
            </div>
            {track.prev != null ? (
              <div>
                <SongPreview preview={track.prev} autoplay={autoplay} />
              </div>
            ) : (
              <div className="overflow-scroll whitespace-nowrap no-scrollbar">
                There is no preview for this song
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>Failed to load for some reason (Try refreshing page)</div>
      )}
    </div>
  );
};

export default Songinfo;
