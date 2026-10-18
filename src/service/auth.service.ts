import axios from "axios";
import type { RegisterFormeSchema } from "../schema/Register";
import type { LoginFormeSchema } from "../schema/Login";

const BASE_URL = "https://route-posts.routemisr.com";
const signUpEndPoint = "users/signup";
const signInEndPoint = "users/signin";

// Sign Up
async function signUp(data: RegisterFormeSchema) {
  const {
    data: {
      message,
      data: { token },
    },
  } = await axios.request({
    url: `${BASE_URL}/${signUpEndPoint}`,
    method: "POST",
    data,
  });
  return { message, token };
}
// Sign In
async function signIn(data: LoginFormeSchema) {
  const {
    data: {
      message,
      data: { token, user },
    },
  } = await axios.request({
    url: `${BASE_URL}/${signInEndPoint}`,
    method: "POST",
    data,
  });
  return { message, token, user };
}
const changePasswordEndPoint = "users/change-password";

// Change Password
async function changePassword(
  token: string | null,
  data: { password: string; newPassword: string },
) {
  return await axios.request({
    url: `${BASE_URL}/${changePasswordEndPoint}`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}

export { signUp, signIn, changePassword };
