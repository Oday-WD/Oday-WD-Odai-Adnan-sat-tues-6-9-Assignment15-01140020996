import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./../layouts/MainLayout/MainLayout";
import { Feed } from "./../pages/Feed/Feed";
import { Profile } from "./../pages/Profile/Profile";
import { AuthLayout } from "./../layouts/AuthLayout/AuthLayout";
import { Login } from "./../pages/Auth/Login/Login";
import { Register } from "./../pages/Auth/Register/Register";
import { Notifications } from "../pages/notifications/Notifications";
import { ProtectedRoutes } from "./ProtectedRoutes";
import ProtectedAuthRoutes from "./ProtectedAuthRoutes";
import { PostDetails } from "../pages/PostDetails/PostDetails";
import { Settings } from "../pages/Settings/Settings";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          { index: true, element: <Feed /> },
          { path: "/feed", element: <Feed /> },
          { path: "/post/:postId", element: <PostDetails /> },
          { path: "/profile/:userId", element: <Profile /> },
          { path: "/notifications", element: <Notifications /> },
          { path: "/settings", element: <Settings /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedAuthRoutes />,
    children: [
      {
        path: "Auth",
        element: <AuthLayout />,
        children: [
          { index: true, element: <Login /> },
          { path: "Login", element: <Login /> },
          { path: "Register", element: <Register /> },
        ],
      },
    ],
  },
]);
