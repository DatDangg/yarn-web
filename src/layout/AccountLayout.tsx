import { NavLink, Outlet, useLocation } from "react-router"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { useEffect, useState } from "react"
import PageBanner from "../components/ui/PageBanner"

function AccountLayout() {
    const [isShow, setIsShow] = useState(false)
    const location = useLocation()
    const page = location.pathname.split('/')[location.pathname.split('/').length - 1]

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
            <div className="mb-[24px] mt-[100px]">
                <PageBanner name={page} />
                <div className="relative pt-[28px]">
                    <img className="absolute" src='/line.png' />
                    <img className="absolute" src='/line1.png' />
                </div>
                <div className="container">
                    <div className="flex">
                        <NavLink
                            to="profile"
                            className={({ isActive }) =>
                                `no-underline font-[family-name:var(--font-Gentium)] px-[12px] py-[6px] uppercase text-[18px] font-[600] cursor-pointer border-[2px] border-b-[#e5e2e2] border-transparent border-r-0 border-t-0 border-l-0
                                hover:text-[var(--active-color)] hover:border-b-[var(--active-color)]
                                ${isActive ? 'text-[var(--active-color)] border-b-[var(--active-color)]' : 'text-[var(--text-color)]'}`
                            }
                        >
                            <span className=" font-[family-name:var(--font-Gentium)]">Profile</span>
                        </NavLink>

                        <NavLink
                            to="order"
                            className={({ isActive }) =>
                                `no-underline font-[family-name:var(--font-Gentium)] px-[12px] py-[6px] uppercase text-[18px] font-[600] cursor-pointer border-[2px] border-b-[#e5e2e2] border-transparent border-r-0 border-t-0 border-l-0
                                hover:text-[var(--active-color)] hover:border-b-[var(--active-color)]
                                ${isActive ? 'text-[var(--active-color)] border-b-[var(--active-color)]' : 'text-[var(--text-color)]'}`
                            }
                        >
                            <span className=" font-[family-name:var(--font-Gentium)]">Order</span>
                        </NavLink>
                    </div>

                </div>
            </div>
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

export default AccountLayout