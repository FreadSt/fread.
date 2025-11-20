import React, { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      let attempts = 0;

      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const interval = setInterval(() => {
        attempts++;
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(interval);
        }

        if (attempts > 40) {
          console.warn("Anchor not found after waiting:", id);
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    } else if (navigationType !== "POP") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash, navigationType]);

  return null;
};

export default ScrollToTop;