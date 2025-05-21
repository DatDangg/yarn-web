import { useEffect, useRef } from "react";
import Lenis from "lenis";

const SmoothText: React.FC<any> = ({text, title}) => {
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
      let reverse = 1 - progress;
      wrapper.style.setProperty("--reverse-progress", reverse.toString());
    });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (

      <div
        ref={wrapperRef}
        className="relative h-full w-full flex flex-col justify-end items-end mb-[20px] pb-[20px] bg-[red] [clip-path:inset(0_0_calc(var(--reverse-progress,1)*100%+15px)_0_round_8px)]"
      >
        <div className=" 
          before:absolute before:top-0 before:left-0 before:bottom-0 before:right-0 before:[clip-path:inset(0_0_calc(var(--reverse-progress,1)*100%+15px)_0_round_8px)] before:bg-[#ccc] before:content-[''] before:[clip-path:inset(0_0_0_0_round_8px)] 
          after:absolute after:top-0 after:left-0 after:bottom-0 after:right-0 after:[clip-path:inset(1px_1px_calc(var(--reverse-progress,1)*100%+16px)_1.5px_round_8px)] after:bg-[white] after:content-[''] after:[clip-path:inset(1px_1px_1px_1.5px_round_8px)]
          "
        ></div>
        <div className="sticky w-full bottom-[18px] py-[20px] px-[40px]">
          <div className="text-[24px] uppercase font-[500]"> 
            {title}
          </div>
          <div className="text-[24px]"> 
            {text.split('\n').map((line: any, index: number) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      </div>
  
  );
}

export default SmoothText