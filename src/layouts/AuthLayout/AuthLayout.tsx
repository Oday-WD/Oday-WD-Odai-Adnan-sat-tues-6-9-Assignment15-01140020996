import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { BrandSection } from "./../../components/Auth/BrandSection/BrandSection";

export const AuthLayout = () => {
  const { pathname } = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");

  useEffect(() => {
    setMode(pathname.toLowerCase().includes("register") ? "register" : "login");
  }, [pathname]);

  return (
    <div className="px-4 py-8 sm:py-12 lg:flex lg:items-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
        <BrandSection />
        <section className="order-1 w-full max-w-107.5 lg:order-2">
          <div className="rounded-2xl bg-white p-4 sm:p-6">
            <div className="mb-4 text-center lg:hidden">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
                Route Posts
              </h1>
              <p className="mt-1 text-base font-medium leading-snug text-slate-700">
                Connect with friends and the world around you on Route Posts.
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <Link
                to="/Auth/Login"
                className={`rounded-lg py-2 text-center text-sm font-extrabold transition ${
                  mode === "login"
                    ? "bg-white text-[#00298d] shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Login
              </Link>
              <Link
                to="/Auth/Register"
                className={`rounded-lg py-2 text-center text-sm font-extrabold transition ${
                  mode === "register"
                    ? "bg-white text-[#00298d] shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Register
              </Link>
            </div>
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};