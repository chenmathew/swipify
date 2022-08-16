import React, { useEffect, useState } from "react";
import { getNewTrack } from "./helpers/tokenhelpers";
import SongPreview from "./songpreview";

interface LikedMusicProps {
  setLiked: any;
  liked: any;
  track: any;
  token: string;
  autoplay: boolean;
  setTrack: any;
}

export const LikedMusic: React.FC<LikedMusicProps> = ({
  setLiked,
  liked,
  autoplay,
}) => {
  const deleteLiked = (e: any) => {
    const index = e.target.value;
    let newLikedNames = [...liked.name];
    let newLikedURIs = [...liked.uri];
    let newLikedPreviews = [...liked.preview];
    let newLikedArtist = [...liked.artist];
    if (index !== -1) {
      newLikedNames.splice(index, 1);
      newLikedURIs.splice(index, 1);
      newLikedPreviews.splice(index, 1);
      newLikedArtist.splice(index, 1);
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
    const artist = liked.artist.map((res: string) => res);
    return (
      <div>
        <div className="grid grid-flow-col">
          <div className="w-44 p-2 ml-2">Track Name</div>
          <div className="w-44 p-2">Artist</div>
          <div className="w-24 p-2"></div>
          <div className="w-12 p-2"></div>
        </div>
        {liked.name.map((name: string, i: number) => (
          <div key={uri[i]} className="m-2">
            <div className="grid grid-flow-col">
              <div className="w-44 p-2 whitespace-nowrap overflow-scroll">
                {name}
              </div>
              <div className="w-44 p-2 whitespace-nowrap overflow-scroll">
                {artist[i]}
              </div>
              {preview[i] !== null ? (
                <span className="p-2 w-24">
                  <SongPreview preview={preview[i]} autoplay={false} />
                </span>
              ) : (
                <span className="w-24 p-2">-</span>
              )}
              <span className="w-12 p-2">
                <div>
                  <button onClick={deleteLiked} value={i}>
                    Delete
                  </button>
                </div>
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div>{updateLiked()}</div>
    </div>
  );
};
