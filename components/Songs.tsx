import { useRecoilValue } from "recoil";
import { PlaylistTrackObject, SinglePlaylistResponse } from "../@Types";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

const Songs = () => {
  const playlist = useRecoilValue<SinglePlaylistResponse>(playlistState);

  return (
    <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
      {playlist?.tracks?.items.map((track: PlaylistTrackObject, i: number) => (
        <Song key={track.track?.id + i} track={track} order={i} />
      ))}
    </div>
  );
};

export default Songs;
