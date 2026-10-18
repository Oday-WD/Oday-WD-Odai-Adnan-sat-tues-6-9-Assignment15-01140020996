import { Navbar } from "./../../components/Layout/Navbar/Navbar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet/>
    </>
  );
};
