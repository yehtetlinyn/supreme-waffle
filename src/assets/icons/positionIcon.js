import React from "react";

function PositionIcon({color}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="16"
      fill="none"
      viewBox="0 0 18 16"
    >
      <path
        stroke="#2F4858"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.7"
        d="M8 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
      ></path>
      <path
        stroke="#2F4858"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.7"
        d="M13 2.5H3a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V3a.5.5 0 00-.5-.5zM3.612 13.5a4.501 4.501 0 018.777 0"
      ></path>
      <path
        fill="#fff"
        d="M18 13c0 2.761-2.239 2.5-5 2.5s-5 .261-5-2.5c0-2.996 2.239-3 5-3s5 0 5 3z"
      ></path>
      <path
        stroke="#2F4858"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.7"
        d="M11.25 12.703h3.375M12.094 14.39h-1.406a1.688 1.688 0 110-3.374h1.406M13.781 14.39h1.407a1.688 1.688 0 000-3.374H13.78"
      ></path>
    </svg>
  );
}

export default PositionIcon;