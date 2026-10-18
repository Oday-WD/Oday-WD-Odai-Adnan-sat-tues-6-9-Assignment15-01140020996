import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterFormeSchema,
  type RegisterFormeSchemaInput,
} from "../../../schema/Register";
import { signUp } from "../../../service/auth.service";
import { Button, Spinner,} from "@heroui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const navigate =useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormeSchemaInput, any, RegisterFormeSchema>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "" as unknown as "male" | "female",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  
  async function handleRegister(data: RegisterFormeSchema) {
    try {
      const {message}= await signUp(data);
      toast.success(message)
      navigate('/auth/login')

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something wrong")
      } else {
        toast.error("Something wrong");
      }
    }
  }

  return (
    <>
      {/* Title */}
      <h2 className="text-2xl font-extrabold text-slate-900">
        Create a new account
      </h2>
      <p className="mt-1 text-sm text-slate-500">It is quick and easy.</p>

      {/* Form */}
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="mt-5 space-y-3.5"
      >
        {/* Full name */}
        <div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-user text-base"></i>
            </span>
            <input
              {...register("name")}
              placeholder="Full name"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
              type="text"
              name="name"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              {errors.name?.message}
            </p>
          )}
        </div>

        {/* Username */}
        <div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-at text-base"></i>
            </span>
            <input
              {...register("username")}
              placeholder="Username (optional)"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
              type="text"
              name="username"
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              {errors.username?.message}
            </p>
          )}
        </div>

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

        {/* Gender */}
        <div>
          <div className="relative">
            <i className="fa-solid fa-venus-mars pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base"></i>
            <select
              {...register("gender")}
              name="gender"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          {errors.gender && (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              {errors.gender?.message}
            </p>
          )}
        </div>

        {/* Date of birth */}
        <div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-calendar-days text-base"></i>
            </span>
            <input
              {...register("dateOfBirth")}
              placeholder="Date of birth"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
              type="date"
              name="dateOfBirth"
            />
          </div>
          {errors.dateOfBirth && (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              {errors.dateOfBirth?.message}
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

        {/* Confirm password */}
        <div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-key text-base"></i>
            </span>
            <input
              {...register("rePassword")}
              placeholder="Confirm password"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
              type="password"
              name="rePassword"
            />
          </div>
          {errors.rePassword && (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              {errors.rePassword?.message}
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
