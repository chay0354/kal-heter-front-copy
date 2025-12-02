import React from "react";

export const CheckCircle = ({ className }) => {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="url(#gradient-check)" />
      <path
        d="M16 24L22 30L32 18"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="gradient-check" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#FA7D00" />
          <stop offset="100%" stopColor="#FFC039" />
        </linearGradient>
      </defs>
    </svg>
  );
};

