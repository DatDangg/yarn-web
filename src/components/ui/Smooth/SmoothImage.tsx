import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import useScrollTriggerOnMount from "../../../hooks/useScrollTriggerOnMount";

interface SmoothImageSliderProps {
  images: string[];
}

const SmoothImage: React.FC<{ src: string }> = ({ src }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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

    const handleScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const imageHeight = wrapper.offsetHeight;

      const visibleHeight = windowHeight - rect.top;
      const progress = Math.min(Math.max(visibleHeight / imageHeight, 0), 1);
      const reverse = 1 - progress;

      wrapper.style.setProperty("--reverse-progress", reverse.toString());
    };

    lenis.on("scroll", handleScroll);

    handleScroll();


    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-[500px] mx-auto h-[580px] flex justify-center items-center [clip-path:inset(0_0_calc(var(--reverse-progress,1)*100%+15px)_0_round_12px)] will-change-[clip-path]"
    >
      <div className="overflow-hidden rounded-[12px]">
        <img
          src={src}
          alt="Smooth slide"
          className="w-full block rounded-[12px]"
        />
      </div>
    </div>
  );
};

const SmoothImageSlider: React.FC<SmoothImageSliderProps> = ({ images }) => {
  return (
    <Swiper
      modules={[Pagination, Navigation, Autoplay]}
      loop={true}
      autoplay={{ delay: 100000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      className="w-full h-[600px] my-auto"
    >
      {images.map((src, index) => (
        <SwiperSlide key={index}>
          <SmoothImage src={src} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SmoothImageSlider;
