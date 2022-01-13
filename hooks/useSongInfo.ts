import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useSpotify from "./useSpotify";
import { currentTrackIdState } from "../atoms/songAtom";

const useSongInfo = () => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState<string | null>(
    currentTrackIdState
  );
  const [songInfo, setSongInfo] =
    useState<SpotifyApi.SingleTrackResponse | null>(null);
  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo: SpotifyApi.SingleTrackResponse = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        setSongInfo(trackInfo);
      }
    };
    fetchSongInfo();
  }, [currentTrackId, spotifyApi]);
  return songInfo;
};

export default useSongInfo;
