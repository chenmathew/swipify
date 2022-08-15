import React, { useState } from "react";

interface LikedMusicProps {
  setLiked: any;
  liked: any;
  track: any;
  getNewTrack: any;
  token: string;
}

export const LikedMusic: React.FC<LikedMusicProps> = ({
  setLiked,
  liked,
  track,
  getNewTrack,
  token,
}) => {
  const [double, setDouble] = useState(false);
  const like = async () => {
    setDouble(true);
    setLiked({
      name: [...liked.name, track.name],
      uri: [...liked.uri, track.uri],
    });
    await getNewTrack(token);

    // Try to force to rerender
    // .catch(async () => {
    //   console.log("works");
    //   while (loop === true) getNewTrack(token);
    //   setLoop(true);
    // });
    setDouble(false);
  };

  const updateLiked = () => {
    const uri = liked.uri.map((id: string) => id);
    return (
      <div>
        <div>
          {liked.name.map((name: string, i: number) => (
            <div key={uri[i]}>{name}</div>
          ))}
        </div>
      </div>
    );
  };
  const dislike = async () => {
    setDouble(true);
    await getNewTrack(token);
    setDouble(false);
  };
  return (
    <div>
      <div>
        <button disabled={double} onClick={like} value={track.name}>
          Like
        </button>
      </div>
      <button disabled={double} onClick={dislike}>
        Dislike
      </button>
      <div>{updateLiked()}</div>
    </div>
  );
};
