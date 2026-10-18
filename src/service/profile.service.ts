import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com";
const userEndpoint = "users";
const profileEndpoint = "profile";
const postEndpoint = "posts";

// Profile Info
export async function getProfileInfo(token: string | null, userId: string) {
  return await axios.request({
    url: `${BASE_URL}/${userEndpoint}/${userId}/${profileEndpoint}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// My Profile Info
export async function getMyProfileInfo(token: string | null) {
  return await axios.request({
    url: `${BASE_URL}/${userEndpoint}/profile-data`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// User Posts
export async function getUserPosts(token: string | null, userId: string) {
  return await axios.request({
    url: `${BASE_URL}/${userEndpoint}/${userId}/${postEndpoint}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Upload Profile Photo
export async function uploadProfilePhoto(token: string | null, data: FormData) {
  return await axios.request({
    url: `${BASE_URL}/${userEndpoint}/upload-photo`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}

// Upload Cover
export async function uploadCover(token: string | null, data: FormData) {
  return await axios.request({
    url: `${BASE_URL}/${userEndpoint}/upload-cover`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}

// Remove Cover
export async function removeCover(token: string | null) {
  return await axios.request({
    url: `${BASE_URL}/${userEndpoint}/cover`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Bookmarks
export async function getBookmarks(token: string | null) {
  return await axios.request({
    url: `${BASE_URL}/${userEndpoint}/bookmarks`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// Follow / Unfollow
export async function followUser(token: string | null, userId: string) {
  return await axios.request({
    url: `${BASE_URL}/${userEndpoint}/${userId}/follow`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}