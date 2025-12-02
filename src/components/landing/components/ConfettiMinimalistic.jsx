import React from "react";

export const ConfettiMinimalistic = ({ className }) => {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="url(#gradient-confetti)" />
      <circle cx="18" cy="18" r="2" fill="white" />
      <circle cx="30" cy="20" r="2" fill="white" />
      <circle cx="22" cy="28" r="2" fill="white" />
      <circle cx="28" cy="30" r="2" fill="white" />
      <path
        d="M20 16L24 20M26 22L30 26"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="gradient-confetti" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#FA7D00" />
          <stop offset="100%" stopColor="#FFC039" />
        </linearGradient>
      </defs>
    </svg>
  );
};

