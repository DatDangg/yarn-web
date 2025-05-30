import { Outlet } from "react-router"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { useEffect, useState } from "react"

function MainLayout() {
    const [isShow, setIsShow] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > document.documentElement.scrollHeight / 3) {
                setIsShow(true)
            } else {
                setIsShow(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
            {isShow &&
                <div
  className="fixed z-[999] bottom-[10px] right-[12px] bg-[var(--primary2-color)] w-[45px] h-[45px] flex justify-center items-center cursor-pointer group"
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[20px] h-[20px] fill-white group-hover:animate-bounce-y"
  >
    <path d="M12 3.75L21.55 20.25H2.45L12 3.75ZM5.05 18.75H18.95L12 6.75L5.05 18.75Z" />
  </svg>
</div>


            }
        </>
    )
}

export default MainLayout