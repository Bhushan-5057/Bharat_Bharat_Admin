"use client";
import React from "react";

const NewtonsCradleLoader = () => {
  return (
    <div className="relative flex items-center justify-center w-[50px] h-[50px]">
      <div className="newtons-cradle__dot first"></div>
      <div className="newtons-cradle__dot"></div>
      <div className="newtons-cradle__dot"></div>
      <div className="newtons-cradle__dot last"></div>

      <style jsx>{`
        .newtons-cradle__dot {
          position: relative;
          display: flex;
          align-items: center;
          height: 100%;
          width: 25%;
          transform-origin: center top;
        }

        .newtons-cradle__dot::after {
          content: "";
          display: block;
          width: 100%;
          height: 25%;
          border-radius: 50%;
          /* Default color = Tailwind variable */
          background-color: currentColor;
        }

        .newtons-cradle__dot.first {
          animation: swing 1.2s linear infinite;
        }

        .newtons-cradle__dot.last {
          animation: swing2 1.2s linear infinite;
        }

        @keyframes swing {
          0% {
            transform: rotate(0deg);
            animation-timing-function: ease-out;
          }
          25% {
            transform: rotate(70deg);
            animation-timing-function: ease-in;
          }
          50% {
            transform: rotate(0deg);
            animation-timing-function: linear;
          }
        }

        @keyframes swing2 {
          0% {
            transform: rotate(0deg);
            animation-timing-function: linear;
          }
          50% {
            transform: rotate(0deg);
            animation-timing-function: ease-out;
          }
          75% {
            transform: rotate(-70deg);
            animation-timing-function: ease-in;
          }
        }
      `}</style>
    </div>
  );
};

export default NewtonsCradleLoader;
