"use client";

import { IMGAGES } from "@/components/common/constants/utlis";
import GridShape from "@/components/common/GridShape";
import Image from "next/image";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const logoSrc = IMGAGES.LOGO_LIGHT;

  return (
    <div className="relative z-1 bg-white p-6 sm:p-0">
      <div className="relative flex h-screen w-full flex-col justify-center lg:flex-row sm:p-0">
        <div className="mb-6 flex flex-col items-center sm:hidden">
          <Image
            className="user-select-none"
            width={231}
            height={40}
            src={logoSrc}
            alt="Bharat Bharati Trust Logo"
            style={{ width: "auto", height: "auto" }}
          />
          <p className="mt-2 text-center text-sm text-gray-700">
            Dedicated to serving society through education, cultural preservation, and community welfare.
            <br />
            <span className="text-gray-900">Bharat Bharati Trust</span>
          </p>
        </div>

        {children}

        <div className="hidden h-full w-full items-center bg-gradient-to-b from-[#FF9933] via-white to-[#138808] lg:grid lg:w-1/2">
          <div className="relative z-1 flex items-center justify-center">
            <GridShape />
            <div className="flex max-w-xs flex-col items-center">
              <Image
                className="user-select-none"
                width={231}
                height={40}
                src={logoSrc}
                alt="Bharat Bharati Trust Logo"
                style={{ width: "auto", height: "auto" }}
              />
              <p className="text-center text-gray-700">
                Dedicated to serving society through education, cultural preservation, and community welfare.
                <br />
                <span className="text-gray-900">Bharat Bharati Trust</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
