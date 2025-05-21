import { useEffect, useRef } from "react";
import Lenis from "lenis";
type SmoothTextProps = {
  text: string | string[];
  title: string;
};

const SmoothText: React.FC<SmoothTextProps> = ({ text, title }) => {
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

  // Convert to array of lines
  const lines = Array.isArray(text)
    ? text
    : text.split('\n'); // fallback if it's a single string with line breaks

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
      <div className="sticky w-full bottom-[18px] pt-[40px] pb-[20px] px-[40px]">
        <div className="text-[24px] uppercase font-[500]">{title}</div>
        <div className="text-[24px] mt-[24px]">
          {Array.isArray(text) ? (
            <ul className="list-none pl-0">
              {lines.map((line, index) => (
                <li key={index} className="flex items-start gap-2 mb-2">
                  <span role="img" aria-label="cat">😸</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : (
            lines.map((line, index) => <p key={index}>{line}</p>)
          )}
        </div>

      </div>
    </div>
  );
};


export default SmoothText