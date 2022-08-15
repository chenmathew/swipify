import React, { useState } from "react";
import SongPreview from "./songpreview";

interface LikedMusicProps {
  setLiked: any;
  liked: any;
  track: any;
  getNewTrack: any;
  token: string;
  autoplay: boolean;
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
      preview: [...liked.preview, track.prev],
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

  const deleteLiked = (e: any) => {
    const index = e.target.value;
    let newLikedNames = [...liked.name];
    let newLikedURIs = [...liked.uri];
    let newLikedPreviews = [...liked.preview];
    if (index !== -1) {
      newLikedNames.splice(index, 1);
      newLikedURIs.splice(index, 1);
      newLikedPreviews.splice(index, 1);
      setLiked({
        name: newLikedNames,
        uri: newLikedURIs,
        preview: newLikedPreviews,
      });
    }
  };

  const updateLiked = () => {
    const uri = liked.uri.map((id: string) => id);
    const preview = liked.preview.map((link: string) => link);
    return (
      <div>
        {liked.name.map((name: string, i: number) => (
          <div key={uri[i]}>
            {name}
            {preview[i] !== null ? (
              <span>
                {/* <ReactAudioPlayer controls src={preview[i]} /> */}
                <SongPreview preview={preview[i]} />
              </span>
            ) : (
              <span></span>
            )}
            <span>
              <button onClick={deleteLiked} value={i}>
                Delete
              </button>
            </span>
          </div>
        ))}
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
