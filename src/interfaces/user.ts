export interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
  email?: string;
  cover?: string;
  followers?: { _id: string }[];
  following?: { _id: string }[];
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
}