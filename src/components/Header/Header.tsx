import { useTranslation } from 'react-i18next';
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
    const { i18n } = useTranslation();
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const changeLanguage = (lang: 'en' | 'vi') => {
        i18n.changeLanguage(lang);
    };

    return (
        <div style={{ backgroundImage: `url(/bgHeader.png)` }}>
            <div className='container'>
                <div className='row items-center py-1'>
                    <div className='col-lg-3'>
                        <Link to='/'>
                            <img src='/logo.png' className='w-[230px] cursor-pointer'></img>
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
                                    to={"/faq"}>FAQ</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className='col-lg-2'>
                        <ul className='m-0 list-none flex items-center justify-end'>
                            <li className="px-[12px] py-[12px] font-[600] text-[24px]">
                                {isAuthenticated
                                ?<i className="fa-regular fa-user"></i>
                                :<button onClick={() => navigate("/login")} className='uppercase text-[18px] border-2 border-[var(--border-color)] px-[14px] py-[3px] hover:bg-[var(--active-color)] hover:border-[var(--active-color)] hover:text-[#fff]'>Login</button>
                                }
                            </li>
                            <li className="relative px-[12px] py-[12px] font-[600] text-[24px]">
                                <i className="fa-solid fa-cart-shopping"></i>
                                <div className="absolute flex justify-center border-[1.5px] border-[#fff] items-center top-[5px] right-[1px] bg-[var(--primary2-color)] w-[22px] h-[22px] rounded-[50%]">
                                    <div className='text-[#fff] text-[12px] leading-[12px]'>10</div>
                                </div>
                            </li>
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
    );
}

export default Header;
