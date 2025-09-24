"use client";

import { IMGAGES } from "@/components/common/constants/utlis";
import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthContent>{children}</AuthContent>
    </ThemeProvider>
  );
}

const AuthContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? IMGAGES.LOGO_DARK : IMGAGES.LOGO_LIGHT;

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">

        <div className="flex flex-col items-center mb-6 sm:hidden">
          <Image
            className="user-select-none"
            width={231}
            height={40}
            src={logoSrc}
            alt="Bharat Bharati Trust Logo"
          />
          <p className="text-center text-gray-700 dark:text-white/80 text-sm mt-2">
            Dedicated to serving society through education, cultural preservation, and community welfare.
            <br />
            <span className="text-gray-900 dark:text-white">
              Bharat Bharati Trust
            </span>
          </p>
        </div>

        {children}

        <div className="lg:w-1/2 w-full h-full 
          bg-gradient-to-b from-[#FF9933] via-white to-[#138808] 
          dark:from-[#FF9933]/80 dark:via-gray-900 dark:to-[#138808]/80 
          lg:grid items-center hidden"
        >
          <div className="relative items-center justify-center flex z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Image
                className="user-select-none"
                width={231}
                height={40}
                src={logoSrc}
                alt="Bharat Bharati Trust Logo"
              />
              <p className="text-center text-gray-700 dark:text-white/80">
                Dedicated to serving society through education, cultural preservation, and community welfare.
                <br />
                <span className="text-gray-900 dark:text-white">
                  Bharat Bharati Trust
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
};
