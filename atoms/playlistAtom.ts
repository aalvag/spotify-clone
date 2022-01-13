import { atom } from "recoil";
import type { SinglePlaylistResponse } from "../@Types";

export const playlistIdState = atom<string>({
  key: "playlistIdState",
  default: "37i9dQZF1DX9qNs32fujYe",
});
export const playlistState = atom<SinglePlaylistResponse>({
  key: "playlistState",
  default: <SinglePlaylistResponse>{},
});
