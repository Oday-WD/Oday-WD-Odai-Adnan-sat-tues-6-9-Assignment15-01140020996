import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com";
const postEndpoint = "posts";
const likeEndPoint = "like";
const bookmarkEndPoint = "bookmark";

// All Posts
export async function getAllPosts(
  token: string | null,
  page: number = 1,
  limit: number = 10,
) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}`,
    method: "GET",
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// Single Post
export async function getSinglePost(token: string | null, postId: string) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}/${postId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// Create Post
export async function createPost(token: string | null, data: FormData) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}
// DeletePost
export async function deletePost(token: string | null, postId: string) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}/${postId}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// UpdatePost
export async function updatePost(
  token: string | null,
  postId: string,
  data: FormData,
) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}/${postId}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}
// LikePost
export async function likePost(token: string | null, postId: string) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}/${postId}/${likeEndPoint}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// Save Post
export async function bookmarkPost(token: string | null, postId: string) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}/${postId}/${bookmarkEndPoint}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
