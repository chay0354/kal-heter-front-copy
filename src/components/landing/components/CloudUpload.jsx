import React from "react";

export const CloudUpload = ({ className }) => {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="url(#gradient-cloud)" />
      <path
        d="M24 20V32M24 20L18 26M24 20L30 26"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 28C13.7909 28 12 29.7909 12 32C12 34.2091 13.7909 36 16 36H32C34.2091 36 36 34.2091 36 32C36 29.7909 34.2091 28 32 28"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="gradient-cloud" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#FA7D00" />
          <stop offset="100%" stopColor="#FFC039" />
        </linearGradient>
      </defs>
    </svg>
  );
};

