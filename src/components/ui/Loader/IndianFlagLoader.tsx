"use client";
import { IMAGES } from "@/components/common/constants/utlis";
import Image from "next/image";

export default function IndianFlagLoader() {
  return (
    <div className="loader-wrapper">
      <Image
        src={IMAGES.LOADER_IMAGE}
        alt="Ashoka Chakra"
        width={200}
        height={200}
        className="chakra-img"
        priority
      />
    </div>
  );
}
