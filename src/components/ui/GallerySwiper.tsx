import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';

const GallerySwiper = (img: any) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const images = img.img

    return (
        <div>
            {/* Big Image Swiper */}
            <Swiper
                modules={[Thumbs, Navigation]}
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                className="w-[300px] h-[300px] mx-auto"
                onSlideChange={(swiper: any) => setActiveIndex(swiper.activeIndex)}
            >
                {images.map((src: any, index: any) => (
                    <SwiperSlide key={index}>
                        <img src={src} className="w-full h-full object-cover rounded-lg" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnail Swiper */}
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                slidesPerView={6}
                watchSlidesProgress
                className="mt-4 h-[50px] w-[300px]"
            >
                {images.map((src: any, index: any) => (
                    <SwiperSlide key={index}>
                        <img
                            src={src}
                            className={`w-full h-full object-cover cursor-pointer border-2 rounded-lg 
                                hover:border-red-500
                                ${index === activeIndex ? 'border-red-500' : 'border-[white]'} 
                            `}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}


export default GallerySwiper
