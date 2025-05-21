import { useEffect } from "react";

const useScrollTriggerOnMount = () => {
  useEffect(() => {
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("scroll"));
    });
  }, []);
};

export default useScrollTriggerOnMount;
