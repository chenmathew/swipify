import React, { useState } from "react";
import { getNewTrack } from "./helpers/tokenhelpers";
import SongPreview from "./songpreview";

interface LikeDislike {
  setLiked: any;
  liked: any;
  track: any;
  token: string;
  autoplay: boolean;
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
  const like = async () => {
    setDouble(true);
    setLiked({
      name: [...liked.name, track.name],
      uri: [...liked.uri, track.uri],
      preview: [...liked.preview, track.prev],
    });
    await getNewTrack(token, setTrack);
    setDouble(false);
  };
  const dislike = async () => {
    setDouble(true);
    await getNewTrack(token, setTrack);
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
            <div className="grid grid-flow-col border-2">
              <div className="w-44 p-2 whitespace-nowrap overflow-scroll">
                {name}
              </div>
              {preview[i] !== null ? (
                <span className="w-40 p-2 whitespace-nowrap overflow-scroll">
                  <SongPreview preview={preview[i]} />
                </span>
              ) : (
                <span className="w-40 p-2 whitespace-nowrap overflow-scroll">
                  No preview
                </span>
              )}
              <span className="w-40 p-2">
                <button onClick={deleteLiked} value={i}>
                  Delete
                </button>
              </span>
            </div>
          </div>
        ))}
      </div>
    );
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
