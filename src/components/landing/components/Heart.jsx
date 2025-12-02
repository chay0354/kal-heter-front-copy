import React from "react";

export const Heart = ({ className }) => {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="url(#gradient-heart)" />
      <path
        d="M24 18C24 18 20 14 16 14C12 14 10 18 10 22C10 30 24 38 24 38C24 38 38 30 38 22C38 18 36 14 32 14C28 14 24 18 24 18Z"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="gradient-heart" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#FA7D00" />
          <stop offset="100%" stopColor="#FFC039" />
        </linearGradient>
      </defs>
    </svg>
  );
};

