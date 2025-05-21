import React from "react";

interface CustomSVGProps {
  className?: string;
  fillColor?: string;
}

export default function CustomSVG({ className = "", fillColor = "#5B961F" }: CustomSVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="398"
      height="491"
      viewBox="0 0 398 491"
      fill="none"
      className={className}
    >
      <path
        d="M379.428 243C386.515 243 389.172 231.021 380.757 231.021C373.67 230.422 370.569 243 379.428 243Z"
        fill={fillColor}
      />
      <path
        d="M54.7724 16.0469C54.7724 16.0469 5.08079 368.693 34.7417 452.417"
        stroke={fillColor}
        strokeWidth="10"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M239.672 189.283C239.672 189.283 200.766 190.441 107.931 234.039C14.7113 277.638 5.85156 261.047 5.85156 261.047"
        stroke={fillColor}
        strokeWidth="10"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M144.527 58.1016L146.839 384.897"
        stroke={fillColor}
        strokeWidth="10"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M179.58 284.582C179.58 284.582 206.159 289.598 227.346 252.944C248.532 216.291 227.346 210.118 227.346 210.118C227.346 210.118 187.669 201.243 186.899 299.629C186.129 398.015 270.104 299.629 274.341 248.7C274.341 248.7 280.504 284.968 298.994 275.708C317.869 266.448 332.122 220.149 334.433 192.369C336.744 164.59 350.612 362.905 334.433 439.684C317.484 519.936 282.43 472.48 277.037 456.275C273.185 444.7 254.31 378.338 357.16 292.299L391.058 263.747"
        stroke={fillColor}
        strokeWidth="10"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M391.444 5.57422L381.043 215.078"
        stroke={fillColor}
        strokeWidth="10"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
