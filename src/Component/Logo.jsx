import React, { forwardRef } from "react";

const Logo = forwardRef((props, ref) => {
  return (
    <svg id="logo" ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 155.16 59.99">
      <path
        id="bow2"
        d="M152.58,24.91c2.09,10.91-35.9,31.9-73.17,32.56C39.84,58.17.49,35.98,2.58,24.91"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="10"
      />
      <circle id="dot2" cx="77.58" cy="20" r="17.5" strokeWidth="0" fill="#fff" />
      <path
        id="bow1"
        d="M2.58,35.07C.49,24.17,38.48,3.18,75.76,2.52c39.57-.7,78.92,21.5,76.83,32.56"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="10"
      />
      <circle id="dot1" cx="77.58" cy="39.99" r="17.5" strokeWidth="0" fill="#fff" />
    </svg>
  );
});

export default Logo;
