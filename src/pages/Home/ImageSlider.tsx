// ImageSlider.tsx
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

const images = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg"]

export default function ImageSlider() {
  return (
    <Swiper
      modules={[Pagination, Navigation, Autoplay]}
      loop={true}
      autoplay={{ delay: 7000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      effect='fade'
      className="w-full h-[700px]"
    >
      {images.map((src, index) => (
        <SwiperSlide key={index}>
  <div
    className="w-full h-[700px] bg-center bg-cover"
    style={{ backgroundImage: `url(${src})` }}
  />
</SwiperSlide>

      ))}
    </Swiper>
  )
}
