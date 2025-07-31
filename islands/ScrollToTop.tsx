import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (IS_BROWSER) {
      if (globalThis.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  const scrollToTop = () => {
    if (IS_BROWSER) {
      globalThis.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (IS_BROWSER) {
      globalThis.addEventListener("scroll", toggleVisibility);
      return () => {
        globalThis.removeEventListener("scroll", toggleVisibility);
      };
    }
  }, []);

  return (
    <div
      class={`scroll-to-top ${isVisible ? "visible" : "hidden"}`}
    >
      <button
        type="button"
        class="scroll-button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <img
          src="/up-arrow.svg"
          alt="Scroll to Top"
          class="arrow-icon"
        />
      </button>
    </div>
  );
}
