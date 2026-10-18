import { RouterProvider } from "react-router-dom";
import { router } from "./routing/AppRoutes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <div className="min-h-screen bg-[#f0f2f5]">
            <RouterProvider router={router} />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
};
