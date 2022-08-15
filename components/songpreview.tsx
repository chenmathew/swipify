import React, { useEffect, useRef, useState } from "react";

/* 
    Future implementations: 
    - Make a slider bar
*/

interface SongPreviewProps {
  preview: string;
}

const SongPreview: React.FC<SongPreviewProps> = ({ preview }) => {
  const inputEl = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [src, setSrc] = useState(preview);

  useEffect(() => {
    if (isPlaying === true) play();
    else pause();
  }, [isPlaying]);
  const play = async () => {
    // `current` points to the mounted text input element
    if (inputEl.current !== null) {
      inputEl.current.focus();
      inputEl.current.load();
      inputEl.current.play();
    }
    setIsPlaying(true);
  };

  const pause = () => {
    // `current` points to the mounted text input element
    if (inputEl.current !== null) {
      inputEl.current.focus();
      inputEl.current.pause();
    }
    setIsPlaying(false);
  };

  const updateSong = () => {
    if (src !== preview) setSrc(preview);
  };

  useEffect(() => {
    updateSong();
    setIsPlaying(false);
  }, [preview]);

  return (
    <div>
      {
        <div>
          {isPlaying ? (
            <button onClick={() => setIsPlaying(false)}>PAUSE</button>
          ) : (
            <button onClick={() => setIsPlaying(true)}>PLAY</button>
          )}
          <audio ref={inputEl} onEnded={() => setIsPlaying(false)}>
            <source src={src} type="audio/mp3" />
          </audio>
        </div>
      }
    </div>
  );
};

export default SongPreview;
