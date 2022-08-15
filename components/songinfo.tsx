import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LikedMusic } from "./likedmusic";
import SongPreview from "./songpreview";

interface songinfoProps {
  setLiked: any;
  liked: any;
  track: any;
  getNewTrack: any;
  token: string;
  autoplay: boolean;
  setAutoplay: any;
}

export const Songinfo: React.FC<songinfoProps> = ({
  track,
  token,
  getNewTrack,
  liked,
  setLiked,
  autoplay,
  setAutoplay,
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
          <div className="grid border-2 place-content-center text-center">
            <div className="h-64 w-64 relative grid">
              <Image src={track.album} layout="fill" priority />
            </div>
            <div>{track.artist}</div>
            <div>{track.name}</div>
            {track.prev != null ? (
              <div id="AUDIO">
                {/* <ReactAudioPlayer
                  src={track.prev}
                  autoPlay={autoplay}
                  controls
                /> */}
                {/* {isPlaying ? (
                  <button onClick={pause}>PAUSE</button>
                ) : (
                  <button onClick={play}>PLAY</button>
                )}
                <audio ref={inputEl} controls>
                  <source src={track.prev} type="audio/mp3" />
                </audio> */}
                <SongPreview preview={track.prev} />
              </div>
            ) : (
              <div>There is no preview for this song</div>
            )}
          </div>
          <LikedMusic
            track={track}
            token={token}
            getNewTrack={getNewTrack}
            liked={liked}
            setLiked={setLiked}
            autoplay={autoplay}
          />
        </div>
      ) : (
        <div>Failed to load for some reason (Try refreshing page)</div>
      )}
    </div>
  );
};

export default Songinfo;
