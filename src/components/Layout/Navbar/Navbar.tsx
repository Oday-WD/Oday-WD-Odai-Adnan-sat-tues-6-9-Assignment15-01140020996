import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/route.png";
import defaultProfile from "../../../assets/images/default-profile.png";
import { Dropdown, Label, Separator } from "@heroui/react";
import { useAuth } from "../../../context/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

export const Navbar = () => {
  const { pathname } = useLocation();
  const isFeedActive = pathname === "/" || pathname === "/feed";
  const isProfileActive = pathname.startsWith("/profile");
  const { removeUserToken, currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutHandler = () => {
    removeUserToken();
    queryClient.clear();
    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:gap-3 sm:px-3">
        {/* Logo Brand */}
        <div className="flex items-center gap-3">
          <img
            alt="Route Posts"
            className="h-9 w-9 rounded-xl object-cover"
            src={logo}
          />
          <p className="hidden text-xl font-extrabold text-slate-900 sm:block">
            Route Posts
          </p>
        </div>

        {/* NavLinks */}
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
          {/* feed link */}
          <NavLink
            aria-label="Feed"
            to="/"
            className={() =>
              `relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
                isFeedActive
                  ? "bg-white text-[#1f6fe5]"
                  : "text-slate-600 hover:bg-white/90 hover:text-slate-900"
              }`
            }
          >
            <span className="relative">
              <i className="fa-regular fa-house text-base"></i>
            </span>
            <span className="hidden sm:inline">Feed</span>
            <span className="sr-only sm:hidden">Feed</span>
          </NavLink>

          {/* Profile link */}
          <NavLink
            aria-label="Profile"
            to={`/profile/${currentUser?._id}`}
            className={() =>
              `relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
                isProfileActive
                  ? "bg-white text-[#1f6fe5]"
                  : "text-slate-600 hover:bg-white/90 hover:text-slate-900"
              }`
            }
          >
            <span className="relative">
              <i className="fa-regular fa-user text-base"></i>
            </span>
            <span className="hidden sm:inline">Profile</span>
            <span className="sr-only sm:hidden">Profile</span>
          </NavLink>

          {/* Notifications link (I'm not don)*/}
          {/* change hidden to flex  */}
          <NavLink
            aria-label="Notifications"
            to="/notifications"
            className={({ isActive }) =>
              `relative  items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 hidden ${
                isActive
                  ? "bg-white text-[#1f6fe5]"
                  : "text-slate-600 hover:bg-white/90 hover:text-slate-900"
              }`
            }
          >
            <span className="relative">
              <i className="fa-regular fa-comment-dots text-base"></i>
            </span>
            <span className="hidden sm:inline">Notifications</span>
            <span className="sr-only sm:hidden">Notifications</span>
          </NavLink>
        </nav>

        {/* dropdown */}
        <Dropdown>
          <Dropdown.Trigger className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100">
            {/* Profile photo */}
            <img
              alt={currentUser?.name ?? "Profile"}
              className="h-8 w-8 rounded-full object-cover"
              src={currentUser?.photo ?? defaultProfile}
            />

            {/* Profile name */}
            <span className="hidden max-w-35 truncate text-sm font-semibold text-slate-800 md:block">
              {currentUser?.name ?? "Profile"}
            </span>
            <i className="fa-solid fa-bars text-sm text-slate-500"></i>
          </Dropdown.Trigger>

          <Dropdown.Popover className="right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            <Dropdown.Menu dir="ltr">
              {/* Profile */}
              <Dropdown.Item
                id="profile"
                onPress={() => navigate(`/profile/${currentUser?._id}`)}
                textValue="Profile"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <i className=" fa-regular  fa-user text-base"></i>
                <Label>Profile</Label>
              </Dropdown.Item>

              {/* Settings */}
              <Dropdown.Item
                id="settings"
                onPress={() => navigate(`/settings`)}
                textValue="Settings"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <i className="fa-solid fa-gear text-base"></i>
                <Label>Settings</Label>
              </Dropdown.Item>

              <Separator className="my-1 border-t border-slate-200" />

              {/* Logout */}
              <Dropdown.Item
                onPress={logoutHandler}
                id="logout"
                textValue="Logout"
                variant="danger"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <Label>Logout</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </header>
  );
};
