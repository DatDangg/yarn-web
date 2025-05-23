import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Lenis from "lenis";
import useScrollTriggerOnMount from "../../hooks/useScrollTriggerOnMount";


const SmoothVideo: React.FC<{ video: string }> = ({ video }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [width1, setWidth] = useState<any>(0)

  useLayoutEffect(() => {
    setWidth(window.innerWidth/1.8)
  }, [])

  useScrollTriggerOnMount();

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
      const videoHeight = wrapper.offsetHeight;

      const visibleHeight = windowHeight - rect.top;
      const progress = Math.min(Math.max(visibleHeight / videoHeight, 0), 1);
      const reverse = 1 - progress;

      wrapper.style.setProperty("--reverse-progress", reverse.toString());
    });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full mx-auto [clip-path:inset(0_0_calc(var(--reverse-progress,1)*100%+15px)_0_round_12px)] will-change-[clip-path]`}
      style={{maxWidth: `${width1}px`}}  //useLayoutEffect must be use in style not in classname
    >
      <div className="overflow-hidden rounded-[12px] relative">
        <video
          ref={videoRef}
          src={video}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          className="w-full block rounded-[12px] "
        />
        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded"
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  );
};

export default SmoothVideo;
