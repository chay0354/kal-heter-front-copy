import React from "react";

export const NotificationUnreadLines = ({ className }) => {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="url(#gradient-notif)" />
      <path
        d="M18 20H30M18 24H30M18 28H26"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 16H28C29.1046 16 30 16.8954 30 18V32C30 33.1046 29.1046 34 28 34H20C18.8954 34 18 33.1046 18 32V18C18 16.8954 18.8954 16 20 16Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="gradient-notif" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#FA7D00" />
          <stop offset="100%" stopColor="#FFC039" />
        </linearGradient>
      </defs>
    </svg>
  );
};

