import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

interface props {
  images: string[]
}

const ImageSlider:React.FC<props> = ({ images }) => {
  return (
    <Swiper
      modules={[Pagination, Navigation, Autoplay]}
      loop={true}
      autoplay={{ delay: 7000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      effect='fade'
      className="w-full h-[600px]"
    >
      {images.map((src, index) => (
        <SwiperSlide key={index}>
          <div
            className="w-full h-[600px] bg-center bg-cover"
            style={{ backgroundImage: `url(${src})` }}
          />
        </SwiperSlide>

      ))}
    </Swiper>
  )
}

export default ImageSlider