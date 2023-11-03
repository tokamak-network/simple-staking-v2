import { useState, useEffect } from 'react';

// function getWindowDimensions() {
//   const { innerWidth: width, innerHeight: height } = window;
//   return {

//     width,
//     height,
//   };
// }

export function useWindowDimensions() {
  // const [windowDimensions, setWindowDimensions] = useState(
  //   getWindowDimensions()
  // );

  // useEffect(() => {
  //   function handleResize() {
  //     setWindowDimensions(getWindowDimensions());
  //   }

  //   if (window) {
  //     window.addEventListener("resize", handleResize);
  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // }, []);

  // return windowDimensions;
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const handleWindowResize = () => {
    setWidth(screen.width);
    setHeight(window.innerHeight);
    
  };

  useEffect(() => {
    // component is mounted and window is available
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    // unsubscribe from the event on component unmount
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return [width, height];
}
