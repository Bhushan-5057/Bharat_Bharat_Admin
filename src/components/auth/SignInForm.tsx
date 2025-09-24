"use client";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Input from "@/app/types/InputField";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "@/lib/utils/toast";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { loginUser } from "@/store/redux/slice/authSlice";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/validations/authValidation";

const SignInForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const in7Hours = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "admin123",
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    const result = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(result)) {
      const { token,  user  } = result.payload?.data;
      if (token) {
        
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        Cookies.set("authToken", token, {
          expires: in7Hours,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      showSuccess("Login successful!");
      router.replace("/");
    } else {
      showError((result.payload as string) || "Invalid credentials!");
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input type="email" placeholder="info@gmail.com" {...field} />
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div>
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="w-full font-bold font-size-20 text-white!  
                           bg-gradient-to-r from-[#FF9933]  to-[#138808] 
                           hover:opacity-90 transition"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
