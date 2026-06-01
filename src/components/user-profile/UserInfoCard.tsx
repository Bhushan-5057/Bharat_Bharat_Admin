"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/Button";
import { AppDispatch, RootState } from "@/store/redux/store";
import { updateUserThunk } from "@/store/redux/slice/userSlice";
import { setCredentials } from "@/store/redux/slice/authSlice";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "@/components/common/constants/utlis";


interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function UserInfoCard() {
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setName(parsedUser.name || "");
        } else if (authUser) {
          setUser(authUser);
          setName(authUser.name || "");
        } 
      }, [authUser]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id || !name.trim()) return;
    if (password && password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const payload: { id: string; name: string; password?: string } = {
        id: user.id,
        name: name.trim(),
      };

      if (password) {
        payload.password = password;
      }

      const response = await dispatch(updateUserThunk(payload)).unwrap();
      const updatedUser = response.user || response;
      const nextUser = { ...user, ...updatedUser, name: payload.name };

      setUser(nextUser);
      setPassword("");

      if (token) {
        dispatch(setCredentials({ token, user: nextUser }));
      } else {
        localStorage.setItem("user", JSON.stringify(nextUser));
      }

      showSuccess(MESSAGES.EDIT_SUCCESS);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message || MESSAGES.EDIT_ERROR);
      } else if (typeof err === "string") {
        showError(err);
      } else {
        showError(MESSAGES.EDIT_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };
    

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <form onSubmit={handleSubmit} className="w-full">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                User Name
              </p>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <Input value={user?.email || ""} disabled readOnly />
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                New Password
              </p>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Leave blank if you don&apos;t want to change it
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading || !name.trim()}
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>

    
    </div>
  );
}
