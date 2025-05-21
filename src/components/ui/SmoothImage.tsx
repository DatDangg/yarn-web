import { useEffect, useRef } from "react";
import Lenis from "lenis";

const SmoothImage:React.FC<any> = ({ img }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const lenis = new Lenis();

    let rafId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    lenis.on("scroll", () => {
      const rect = wrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const imageHeight = wrapper.offsetHeight;

      const visibleHeight = windowHeight - rect.top;
      const progress = Math.min(Math.max(visibleHeight / imageHeight, 0), 1);
      const reverse = 1 - progress;

      wrapper.style.setProperty("--reverse-progress", reverse.toString());
    });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>

      <div
        ref={wrapperRef}
        className="relative w-full max-w-[500px] mx-auto [clip-path:inset(0_0_calc(var(--reverse-progress,1)*100%+15px)_0_round_4px)] will-change-[clip-path]"
      >
        <div className="overflow-hidden rounded-lg">
          <img
            src={img}
            alt="Wool texture"
            className="w-full block rounded-xl"
          />
        </div>
      </div>

    </>
  );
}

export default SmoothImage