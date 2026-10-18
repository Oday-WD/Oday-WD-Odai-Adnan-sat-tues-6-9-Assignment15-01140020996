import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com";
const postEndpoint = "posts";
const CommentEndpoint = "comments";
const likeEndPoint = "like";

// Post Comments
export async function getPostComments(token: string | null, postId: string) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}/${postId}/${CommentEndpoint}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// Create post Comments
export async function createPostComment(
  token: string | null,
  postId: string,
  data: FormData,
) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}/${postId}/${CommentEndpoint}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}
// Update post Comments
export async function updatePostComment(
  token: string | null,
  postId: string,
  commentId: string,
  data: FormData,
) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}/${postId}/${CommentEndpoint}/${commentId}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}
// Delete post Comments
export async function deletePostComment(
  token: string | null,
  postId: string,
  commentId: string,
) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}/${postId}/${CommentEndpoint}/${commentId}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// Like post Comments
export async function likePostComment(
  token: string | null,
  postId: string,
  commentId: string,
) {
  return await axios.request({
    url: `${BASE_URL}/${postEndpoint}/${postId}/${CommentEndpoint}/${commentId}/${likeEndPoint}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
