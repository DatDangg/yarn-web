import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { useLayoutEffect, useState } from 'react'

interface props {
  images: string[]
}

const ImageSlider:React.FC<props> = ({ images }) => {
  const [height, setHeight] = useState<any>(0)
      useLayoutEffect(() => {
        setHeight(window.innerHeight - 12 - 82) 
      }, [])
  return (
    <Swiper
      modules={[Pagination, Navigation, Autoplay]}
      loop={true}
      autoplay={{ delay: 7000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      effect='fade'
      className="w-full"
      style={{height: `${height}px`}}
    >
      {images.map((src, index) => (
        <SwiperSlide key={index}>
          <div
            className="w-full bg-center bg-cover"
            
            style={{ backgroundImage: `url(${src})`, height: `${height}px` }}
          />
        </SwiperSlide>

      ))}
    </Swiper>
  )
}

export default ImageSlider