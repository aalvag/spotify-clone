import type { Account, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

export interface SESSION_EXT extends Session {
  userAccessToken?: string;
}

export type SessionType =
  | { data: SESSION_EXT; status: "authenticated" }
  | { data: null; status: "loading" | "unauthenticated" };
export type LayoutType = {
  title: string;
  keywords?: string;
  description?: string;
  children?: any;
};
export type JWT_INTERFACE = {
  token: JWT_X;
  user?: User;
  account?: Account;
  isNewUser?: boolean;
};
export interface JWT_X extends JWT {
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  accessTokenExpires?: number;
}
export interface TOKEN_INTERFACE extends JWT {
  // token: JWT;
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  accessTokenExpires?: number;
}

export type SESSION_INTERFACE = {
  session: SESSION_EXT;
  user?: User;
  token: JWT_X;
};
export interface Response<T> {
  body: T;
  headers: Record<string, string>;
  statusCode: number;
}
export interface RefreshAccessTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string | undefined;
  scope: string;
  token_type: string;
}

/**
 * Playlist Object Simplified
 * [](https://developer.spotify.com/web-api/object-model/)
 */
export interface PlaylistObjectSimplified extends PlaylistBaseObject {
  tracks: {
    href: string;
    total: number;
  };
}

interface ImageObject {
  /**
   * The image height in pixels. If unknown: `null` or not returned.
   */
  height?: number | undefined;
  /**
   * The source URL of the image.
   */
  url: string;
  /**
   * The image width in pixels. If unknown: null or not returned.
   */
  width?: number | undefined;
}
interface UserObjectPublic {
  display_name?: string | undefined;
  external_urls: ExternalUrlObject;
  followers?: { href: null; total: number } | undefined;
  href: string;
  id: string;
  images?: ImageObject[] | undefined;
  type: "user";
  uri: string;
}

/**
 * Base Playlist Object. Does not in itself exist in Spotify Web Api,
 * but needs to be made since the tracks types vary in the Full and Simplified versions.
 */
interface PlaylistBaseObject extends ContextObject {
  /**
   * Returns `true` if context is not search and the owner allows other users to modify the playlist.
   * Otherwise returns `false`.
   */
  collaborative: boolean;
  /**
   * The playlist description. Only returned for modified, verified playlists, otherwise null.
   */
  description: string | null;
  /**
   * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the playlist.
   */
  id: string;
  /**
   * Images for the playlist. The array may be empty or contain up to three images.
   * The images are returned by size in descending order.
   * See [Working with Playlists](https://developer.spotify.com/documentation/general/guides/working-with-playlists/).
   * Note: If returned, the source URL for the image (`url`) is temporary and will expire in less than a day.
   */
  images: ImageObject[];
  /**
   * The name of the playlist.
   */
  name: string;
  /**
   * The user who owns the playlist.
   */
  owner: UserObjectPublic;
  /**
   * The playlist’s public/private status:
   * `true` the playlist is public,
   * `false` the playlist is private,
   * or `null` the playlist status is not relevant.
   */
  public: boolean | null;
  /**
   * The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version:
   * see [Remove tracks from a playlist](https://developer.spotify.com/documentation/web-api/reference/playlists/remove-tracks-playlist/).
   */
  snapshot_id: string;
  type: "playlist";
}
interface ContextObject {
  /**
   * The object type.
   */
  type: "artist" | "playlist" | "album" | "show" | "episode";
  /**
   * A link to the Web API endpoint providing full details.
   */
  href: string;
  /**
   * Known external URLs.
   */
  external_urls: ExternalUrlObject;
  /**
   * The [Spotify URI](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids).
   */
  uri: string;
}
interface ExternalUrlObject {
  spotify: string;
}

/**
 * Get a playlist
 *
 * GET /v1/users/{user_id}/playlists/{playlist_id}
 * https://developer.spotify.com/web-api/get-playlist/
 */
export interface SinglePlaylistResponse extends PlaylistObjectFull {}
interface PlaylistObjectFull extends PlaylistBaseObject {
  /**
   * Information about the followers of the playlist.
   */
  followers: FollowersObject;
  /**
   * Information about the tracks of the playlist.
   */
  tracks: PagingObject<PlaylistTrackObject>;
}
interface FollowersObject {
  /**
   * A link to the Web API endpoint providing full details of the followers; `null` if not available.
   * Please note that this will always be set to `null`, as the Web API does not support it at the moment.
   */
  href: null;
  /**
   * The total number of followers.
   */
  total: number;
}
interface PagingObject<T> {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}
export interface PlaylistTrackObject {
  added_at: string;
  added_by: UserObjectPublic;
  is_local: boolean;
  track: TrackObjectFull;
}
interface TrackObjectFull extends TrackObjectSimplified {
  /**
   * The album on which the track appears.
   */
  album: AlbumObjectSimplified;
  /**
   * Known external IDs for the track.
   */
  external_ids: ExternalIdObject;
  /**
   * The popularity of the track. The value will be between `0` and `100`, with `100` being the most popular.
   * The popularity of a track is a value between `0` and `100`, with `100` being the most popular.
   * The popularity is calculated by algorithm and is based, in the most part,
   * on the total number of plays the track has had and how recent those plays are.
   */
  popularity: number;
  /**
   * Whether or not the track is from a local file.
   */
  is_local?: boolean | undefined;
}
interface TrackObjectSimplified {
  /**
   * The artists who performed the track.
   */
  artists: ArtistObjectSimplified[];
  /**
   * A list of the countries in which the track can be played,
   * identified by their [ISO 3166-1 alpha-2 code](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   */
  available_markets?: string[] | undefined;
  /**
   * The disc number (usually `1` unless the album consists of more than one disc).
   */
  disc_number: number;
  /**
   * The track length in milliseconds.
   */
  duration_ms: number;
  /**
   * Whether or not the track has explicit lyrics (`true` = yes it does; `false` = no it does not OR unknown).
   */
  explicit: boolean;
  /**
   * Known external URLs for this track.
   */
  external_urls: ExternalUrlObject;
  /**
   * A link to the Web API endpoint providing full details of the track.
   */
  href: string;
  /**
   * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the track.
   */
  id: string;
  /**
   * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/) is applied.
   * If `true`, the track is playable in the given market. Otherwise, `false`.
   */
  is_playable?: boolean | undefined;
  /**
   * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/) is applied,
   * and the requested track has been replaced with different track.
   * The track in the `linked_from` object contains information about the originally requested track.
   */
  linked_from?: TrackLinkObject | undefined;
  /**
   * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/) is applied,
   * the original track is not available in the given market, and Spotify did not have any tracks to relink it with.
   * The track response will still contain metadata for the original track, and a restrictions object containing the reason
   * why the track is not available: `"restrictions" : {"reason" : "market"}`.
   */
  restrictions?: RestrictionsObject | undefined;
  /**
   * The name of the track.
   */
  name: string;
  /**
   * A link to a 30 second preview (MP3 format) of the track. Can be null
   */
  preview_url: string | null;
  /**
   * The number of the track. If an album has several discs, the track number is the number on the specified disc.
   */
  track_number: number;
  /**
   * The object type: “track”.
   */
  type: "track";
  /**
   * The [Spotify URI](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the track.
   */
  uri: string;
}
interface ArtistObjectSimplified extends ContextObject {
  /**
   * The name of the artist.
   */
  name: string;
  /**
   * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the artist.
   */
  id: string;
  type: "artist";
}
interface AlbumObjectSimplified extends ContextObject {
  /**
   * The field is present when getting an artist’s albums.
   * Possible values are “album”, “single”, “compilation”, “appears_on”.
   * Compare to album_type this field represents relationship between the artist and the album.
   */
  album_group?: "album" | "single" | "compilation" | "appears_on" | undefined;
  /**
   * The type of the album: one of “album”, “single”, or “compilation”.
   */
  album_type: "album" | "single" | "compilation";
  /**
   * The artists of the album.
   * Each artist object includes a link in href to more detailed information about the artist.
   */
  artists: ArtistObjectSimplified[];
  /**
   * The markets in which the album is available: [ISO 3166-1 alpha-2 country codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   * Note that an album is considered available in a market when at least 1 of its tracks is available in that market.
   */
  available_markets?: string[] | undefined;
  /**
   * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the album.
   */
  id: string;
  /**
   * The cover art for the album in various sizes, widest first.
   */
  images: ImageObject[];
  /**
   * The name of the album. In case of an album takedown, the value may be an empty string.
   */
  name: string;
  /**
   * The date the album was first released, for example `1981`.
   * Depending on the precision, it might be shown as `1981-12` or `1981-12-15`.
   */
  release_date: string;
  /**
   * The precision with which release_date value is known: `year`, `month`, or `day`.
   */
  release_date_precision: "year" | "month" | "day";
  /**
   * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/) is applied,
   * the original track is not available in the given market, and Spotify did not have any tracks to relink it with.
   * The track response will still contain metadata for the original track,
   * and a restrictions object containing the reason why the track is not available: `"restrictions" : {"reason" : "market"}`
   */
  restrictions?: RestrictionsObject | undefined;
  type: "album";
  /**
   * The number of tracks in the album.
   */
  total_tracks: number;
}
interface RestrictionsObject {
  reason: string;
}
/**
 * Track Link Object
 * [](https://developer.spotify.com/web-api/object-model/#track-object-simplified)
 */
interface TrackLinkObject {
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  type: "track";
  uri: string;
}
interface ExternalIdObject {
  isrc?: string | undefined;
  ean?: string | undefined;
  upc?: string | undefined;
}
