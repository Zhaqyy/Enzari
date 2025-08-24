import { useState, useEffect } from "react";

const useIsMobile = (targetWidth = 550) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < targetWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < targetWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [targetWidth]);

  return isMobile;
};

export default useIsMobile;

// To Use

// import useIsMobile from "./useIsMobile";

// const ExampleComponent = () => {
//   const isMobile = useIsMobile(); // Default targetWidth: 550
//   const isTablet = useIsMobile(768); // Custom targetWidth: 768
// }