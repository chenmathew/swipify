import axios from "axios";
import React from "react";

interface CreatePlaylistProps {
  userToken: string;
  liked: any;
  userID: string;
}

export const CreatePlaylist: React.FC<CreatePlaylistProps> = ({
  liked,
  userToken,
  userID,
}) => {
  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    if (liked.name.length === 0) {
      console.log("error making playlist");
      alert("Like some songs before creating playlist");
      return;
    }

    // Get data from the form.
    const data = {
      name: event.target.pname.value,
      description: `Created with https://swipify.vercel.app/builder`,
      public: event.target.type.value,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);
    await axios
      .post(`https://api.spotify.com/v1/users/${userID}/playlists`, JSONdata, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      })
      .then(async (res) => {
        let str = "";
        liked.uri.forEach((item: string) => {
          str += item;
          if (liked.uri[liked.uri.length - 1] === item) return;
          else str += ",";
        });
        str = str.replaceAll(":", "%3A");
        str = str.replaceAll(",", "%2C");
        axios
          .post(
            `https://api.spotify.com/v1/playlists/${res.data.id}/tracks?uris=${str}`,
            null,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((_) => alert("Successfully added playlist"))
          .catch((err) => alert("Error adding playlist"));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="pname"></label>
        <div>
          <input
            type="text"
            id="pname"
            name="pname"
            placeholder="Playlist Name"
            className="focus:outline-0 mb-2 bg-transparent"
            required
          />
        </div>
        {/* <label htmlFor="desc"></label>
        <input
          type="text"
          id="desc"
          name="desc"
          placeholder="Description"
          className="bg-transparent mt-2 mb-2"
          required
        /> */}
        <div className="grid grid-flow-col">
          <input
            type="radio"
            id="public"
            name="type"
            value="true"
            defaultChecked
            required
          />
          <label htmlFor="html">Public</label>
          <input type="radio" id="private" name="type" value="false" required />
          <label htmlFor="css">Private</label>
        </div>
        <button type="submit" className="mt-2 hover:text-red-300 ">
          Create playlist
        </button>
      </form>
    </>
  );
};
