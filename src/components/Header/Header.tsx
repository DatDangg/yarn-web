import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import { useAppSelector } from '../../hooks/useStore'
import { useEffect, useState } from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'

function Header() {
    const { i18n } = useTranslation()
    const { logout, isAuthenticated, user } = useAuth()
    const navigate = useNavigate()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const changeLanguage = (lang: 'en' | 'vi') => {
        i18n.changeLanguage(lang)
    }

    const cartItems = useAppSelector(state => state.cart.items)
    const totalQuantity = cartItems.length

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault()
        logout()
        navigate("/login")
    }
    return (
        <div
            style={{ backgroundImage: !isScrolled ? `url(/bgHeader.png), linear-gradient(white, white)` : "linear-gradient(white, white)", height: isScrolled ? "70px" : "100px", transition: 'all 0.3s ease' }}
            className='fixed top-0 left-0 right-0 z-[20]'
        >
            <div className='container'>
                <div className='row items-center py-1'>
                    <div className='col-lg-3'>
                        <Link to='/' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <img src='/logo.png' className='max-w-[230px] cursor-pointer' style={{ height: isScrolled ? "64px" : "" }}></img>
                        </Link>
                    </div>
                    <div className='col-lg-7 flex justify-center'>
                        <ul className='m-0 flex items-center list-none font-[family-name:var(--font-Gentium)] uppercase text-[24px] text-[var(--primary1-color)]'>
                            <li className='px-[24px] py-[12px] font-[600]'>
                                <NavLink className={({ isActive }) =>
                                    isActive
                                        ? 'text-[var(--active-color)] no-underline'
                                        : 'text-[var(--primary1-color)] no-underline hover:text-[var(--active-color)] hover:cursor-pointer'
                                }
                                    to={"/"}>Home</NavLink>
                            </li>
                            <li className='px-[24px] py-[12px] font-[600]'>
                                <NavLink className={({ isActive }) =>
                                    isActive
                                        ? 'text-[var(--active-color)] no-underline'
                                        : 'text-[var(--primary1-color)] no-underline hover:text-[var(--active-color)] hover:cursor-pointer'
                                }
                                    to={"/about"}>About</NavLink>
                            </li>
                            <li className='px-[24px] py-[12px] font-[600]'>
                                <NavLink className={({ isActive }) =>
                                    isActive
                                        ? 'text-[var(--active-color)] no-underline'
                                        : 'text-[var(--primary1-color)] no-underline hover:text-[var(--active-color)] hover:cursor-pointer'
                                }
                                    to={"/blog"}>Blog</NavLink>
                            </li>
                            <li className='px-[24px] py-[12px] font-[600]'>
                                <NavLink className={({ isActive }) =>
                                    isActive
                                        ? 'text-[var(--active-color)] no-underline'
                                        : 'text-[var(--primary1-color)] no-underline hover:text-[var(--active-color)] hover:cursor-pointer'
                                }
                                    to={"/product"}>Product</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className='col-lg-2'>
                        <ul className='m-0 list-none flex items-center justify-end'>
                            <li className="px-[12px] py-[12px] font-[600] text-[24px]">
                                {isAuthenticated
                                    ?
                                    <div className='relative group w-[35px]'>
                                        {user?.avatar ?
                                            <img src={user.avatar} className='block w-[35px] h-[35px] rounded-[50%]' />
                                            :
                                            <Avatar size={34} icon={<UserOutlined />} />
                                        }
                                        <div className="absolute after:block after:content-[''] after:bg-transparent after:w-[40px] after:h-[5px] bottom-[-1px] right-0"></div>
                                        <ul className='absolute right-0 text-[16px] hidden group-hover:block pl-0 z-[10] w-[180px] bg-white font-[family-name:(var(--font-Gentium)] rounded-[5px] shadow-[0_3px_8px_rgba(0,0,0,0.25)]'>
                                            <li>
                                                <Link to="/" className='no-underline  text-black hover:font-[700] px-[14px] py-[12px] w-full block capitalize hover:bg-[var(--border-color)] hover:!text-[var(--active-color)]'>
                                                    My Account
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/wishlist" className='no-underline  text-black hover:font-[700] px-[14px] py-[12px] w-full block capitalize hover:bg-[var(--border-color)] hover:!text-[var(--active-color)]'>
                                                    My Wishlist
                                                </Link>
                                            </li>
                                            <li
                                                className='cursor-pointer hover:font-[700] px-[14px] py-[12px] w-full block capitalize hover:bg-[var(--border-color)] hover:!text-[var(--active-color)]'
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </li>
                                        </ul>
                                    </div>
                                    : <button onClick={() => navigate("/login")} className='uppercase font-[family-name:var(--font-Gentium)] text-[18px] text-[var(--primary1-color)] font-[700] border-2 border-[var(--border-color)] px-[14px] py-[3px] hover:bg-[var(--active-color)] hover:border-[var(--active-color)] hover:text-[#fff] rounded-[4px]'>Login</button>
                                }
                            </li>
                            <Link to='/cart'>
                                <li className="relative px-[12px] py-[12px] font-[600] text-[24px]">
                                    <i className="fa-solid fa-cart-shopping text-black" />
                                    {totalQuantity > 0 &&
                                        <div className="absolute flex justify-center border-[1.5px] border-[#fff] items-center top-[5px] right-[1px] bg-[var(--primary2-color)] w-[22px] h-[22px] rounded-[50%]">
                                            <div className='text-[#fff] text-[12px] leading-[12px]'>{totalQuantity}</div>
                                        </div>
                                    }
                                </li>
                            </Link>
                            <li className="px-[12px] py-[12px] font-[600]">
                                <div className="relative w-[88px] h-[38px]">
                                    <input
                                        type="checkbox"
                                        id="language-toggle"
                                        className="sr-only peer"
                                        onChange={(e) => changeLanguage(e.target.checked ? 'vi' : 'en')}
                                        checked={i18n.language === 'vi'}
                                    />
                                    <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-full transition-colors duration-300"></div>
                                    {i18n.language === 'vi' ?
                                        <span className="absolute text-[18px] top-[50%] -translate-y-1/2 left-[24px] font-semibold text-gray-800 transition-all duration-300 select-none">
                                            VI
                                        </span>
                                        :
                                        <span className="absolute text-[18px] top-[50%] -translate-y-1/2 left-[48px] font-semibold text-gray-800 transition-all duration-300 select-none">
                                            EN
                                        </span>
                                    }
                                    <label
                                        htmlFor="language-toggle"
                                        className="absolute top-0 left-0 h-[38px] w-[38px] bg-transparent cursor-pointer flex items-center justify-center transition-all duration-300 peer-checked:translate-x-[50px]"
                                    >
                                        <img
                                            src={i18n.language === 'vi' ? '/VNFlag.png' : '/GBFlag.png'}
                                            alt={i18n.language === 'vi' ? 'Vietnamese' : 'English'}
                                            className="w-[28px] h-[28px] object-cover rounded-full border-[white] border-1"
                                        />
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Header
