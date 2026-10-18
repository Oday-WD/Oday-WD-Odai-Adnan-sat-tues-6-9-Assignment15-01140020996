import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Spinner } from "@heroui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  loginSchema,
  type LoginFormeSchema,
  type LoginFormeSchemaInput,
} from "../../../schema/Login";
import { signIn } from "../../../service/auth.service";
import { useAuth } from "../../../context/AuthProvider";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { saveUserToken } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormeSchemaInput, any, LoginFormeSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  async function handleRegister(data: LoginFormeSchema) {
    try {
      const { message, token } = await signIn(data);
      saveUserToken(token);
      toast.success(message);
      navigate("/feed");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something wrong");
      } else {
        toast.error("Something wrong");
      }
    }
  }

  return (
    <>
      {/* Title */}
      <h2 className="text-2xl font-extrabold text-slate-900">
        Log in to Route Posts
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Log in and continue your social journey.
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="mt-5 space-y-3.5"
      >
        {/* Email */}
        <div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-envelope text-base"></i>
            </span>
            <input
              {...register("email")}
              placeholder="Email address"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
              type="email"
              name="email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              {errors.email?.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-key text-base"></i>
            </span>
            <input
              {...register("password")}
              placeholder="Password"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
              type="password"
              name="password"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              {errors.password?.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full rounded-xl py-6 text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b] button--lg"
          isDisabled={!isValid}
          isPending={isSubmitting}
        >
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" size="sm" /> : null}
              Create New Account
            </>
          )}
        </Button>
      </form>
    </>
  );
};
