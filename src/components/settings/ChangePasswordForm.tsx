import { Button, Spinner } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuth } from "../../context/AuthProvider";
import { changePassword } from "../../service/auth.service";
import {
  changePasswordSchema,
  type ChangePasswordFormSchema,
} from "../../schema/ChangePassword";

export const ChangePasswordForm = () => {
  const { token, removeUserToken } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ChangePasswordFormSchema>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  // Change password function
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ChangePasswordFormSchema) =>
      changePassword(token, {
        password: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: function (data) {
      toast.success(`${data.data.message}. Please log in again.`);
      removeUserToken();
      queryClient.clear();
      navigate("/auth/login");
    },
    onError: function (error) {
      toast.error(
        isAxiosError(error) ? error.response?.data.message : error.message,
      );
    },
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Title */}
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
          <i className="fa-solid fa-key text-base"></i>
        </span>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Change Password
          </h1>
          <p className="text-sm text-slate-500">
            Keep your account secure by using a strong password.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        noValidate
        onSubmit={handleSubmit((data) => mutate(data))}
        className="space-y-4"
      >
        {/* Current password */}
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-slate-700">
            Current password
          </span>
          <input
            {...register("currentPassword")}
            placeholder="Enter current password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
            type="password"
          />
          {errors.currentPassword && (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              {errors.currentPassword.message}
            </p>
          )}
        </label>

        {/* New password */}
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-slate-700">
            New password
          </span>
          <input
            {...register("newPassword")}
            placeholder="Enter new password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
            type="password"
          />
          {errors.newPassword ? (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              {errors.newPassword.message}
            </p>
          ) : (
            <span className="mt-1 block text-xs text-slate-500">
              At least 8 characters with uppercase, lowercase, number, and
              special character.
            </span>
          )}
        </label>

        {/* Confirm new password */}
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-slate-700">
            Confirm new password
          </span>
          <input
            {...register("confirmPassword")}
            placeholder="Re-enter new password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
            type="password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </label>

        {/* Submit button */}
        <Button
          type="submit"
          isDisabled={!isValid || isPending}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Spinner color="current" size="sm" />
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </section>
  );
};
