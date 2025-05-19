import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router';

function Header() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: 'en' | 'vi') => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className='container' style={{ backgroundImage: `url(/bgHeader.png)` }}>
            <div className='row items-center py-1'>
                <div className='col-lg-4'>
                    <img src='/Wool.png' className='w-[230px] cursor-pointer'></img>
                </div>
                <div className='col-lg-8 flex justify-end items-center'>
                    <ul className='m-0 flex list-none font-[family-name:var(--font-Gentium)] uppercase text-[24px] text-[var(--primary1-color)]'>
                        <li className='px-[24px] py-[12px] hover:cursor-pointer font-[600]'>
                            <NavLink className={({ isActive }) =>
                                isActive
                                    ? 'text-[var(--active-color)] no-underline'
                                    : 'text-[var(--primary1-color)] no-underline hover:text-[var(--active-color)]'
                            }
                                to={"/"}>Home</NavLink>
                        </li>
                        <li className='px-[24px] py-[12px] hover:cursor-pointer font-[600]'>
                            <NavLink className={({ isActive }) =>
                                isActive
                                    ? 'text-[var(--active-color)] no-underline'
                                    : 'text-[var(--primary1-color)] no-underline hover:text-[var(--active-color)]'
                            }
                                to={"/about"}>About</NavLink>
                        </li>
                        <li className='px-[24px] py-[12px] hover:cursor-pointer font-[600]'>
                            <NavLink className={({ isActive }) =>
                                isActive
                                    ? 'text-[var(--active-color)] no-underline'
                                    : 'text-[var(--primary1-color)] no-underline hover:text-[var(--active-color)]'
                            }
                                to={"/blog"}>Blog</NavLink>
                        </li>
                        <li className='px-[24px] py-[12px] hover:cursor-pointer font-[600]'>
                            <NavLink className={({ isActive }) =>
                                isActive
                                    ? 'text-[var(--active-color)] no-underline'
                                    : 'text-[var(--primary1-color)] no-underline hover:text-[var(--active-color)]'
                            }
                                to={"/faq"}>FAQ</NavLink>
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
                                <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-full peer-checked:bg-gray-300 transition-colors duration-300"></div>
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
    );
}

export default Header;
