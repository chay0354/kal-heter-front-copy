import React from "react";

export const DocumentAdd = ({ className }) => {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="url(#gradient-doc)" />
      <path
        d="M24 18V30M18 24H30"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M16 14H24L32 22V34C32 35.1046 31.1046 36 30 36H18C16.8954 36 16 35.1046 16 34V16C16 14.8954 16.8954 14 18 14Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="gradient-doc" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#FA7D00" />
          <stop offset="100%" stopColor="#FFC039" />
        </linearGradient>
      </defs>
    </svg>
  );
};

