import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
} from "@heroicons/react/outline";
import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Response } from "../@Types";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState<string | null>(
    currentTrackIdState
  );
  console.log(currentTrackId);
  const [volume, setVolume] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState);
  const songInfo: SpotifyApi.SingleTrackResponse | null = useSongInfo();

  const handlePlayPause = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((res: Response<SpotifyApi.CurrentPlaybackResponse>) => {
        if (res.body?.is_playing) {
          spotifyApi.pause();
          setIsPlaying(false);
        } else {
          spotifyApi.play();
          setIsPlaying(true);
        }
      });
  };

  const handlePlayNext = () => {
    spotifyApi.skipToNext();
  };

  const fetchCurrentSong = () => {
    if (!songInfo) {
      console.log("fetchCurrentSong");
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((data: Response<SpotifyApi.CurrentlyPlayingResponse>) => {
          setCurrentTrackId(data.body?.item?.id || null);
          spotifyApi
            .getMyCurrentPlaybackState()
            .then((data: Response<SpotifyApi.CurrentPlaybackResponse>) => {
              setIsPlaying(data.body?.is_playing || false);
              setVolume(data.body?.device?.volume_percent || 50);
            });
        });
    }
  };
  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume);
    }, 500),
    [volume]
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
    }
  }, [currentTrackId, spotifyApi, session]);

  return (
    <div className=" h-24 bg-gradient-to-b from-black to-gray-900 text-white grid md:grid-cols-3 grid-cols-2 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt={songInfo?.album?.name || "unknown album"}
        />
        <div>
          <h3 className="w-40 lg:w-80 truncate">{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          onClick={() =>
            spotifyApi.skipToPrevious().then(
              () => console.log("skipped"),
              (err: any) => console.log(err)
            )
          }
          className="button"
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon className="button w-10 h-10" onClick={handlePlayPause} />
        )}
        <FastForwardIcon onClick={handlePlayNext} className="button" />
        <ReplyIcon className="button" />
      </div>
      <div className=" items-center hidden md:flex space-x-3 md:space-x-4 justify-end py-5">
        <VolumeUpIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          type="range"
          name="volume"
          id="volume"
          aria-label="range of volume 1-100"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeDownIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
