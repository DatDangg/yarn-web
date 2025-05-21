import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Footer() {
    const { t } = useTranslation();
    return (
        <div className="mb-[32px]">
            <div className="relative pb-[32px]">
                <img className="absolute" src='/line.png' />
                <img className="absolute" src='/line1.png' />
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 offset-lg-1">
                        <div>
                            <img src="/logo.png" className="w-[300px]" />
                        </div>
                        <div className="mt-3 text-[16px] font-[600] font-[family-name:var(--font-Gentium)]">
                            {t(`intro.line1`)}<br />
                            {t("intro.line2")}
                        </div>
                    </div>
                    <div className="col-lg-2 offset-lg-1">
                        <div className="font-[700] text-[20px] uppercase">
                            About
                        </div>
                        <ul className="m-0 flex-col pt-[20px] pl-0">
                            <li>
                                <Link to="/" className="no-underline text-[16px] py-[4px] text-[black] font-[600] block hover:text-[var(--active-color)]">Blog</Link>
                            </li>
                            <li>
                                <Link to="/" className="no-underline text-[16px] py-[4px] text-[black] font-[600] block hover:text-[var(--active-color)]">About</Link>
                            </li>
                            <li>
                                <Link to="/" className="no-underline text-[16px] py-[4px] text-[black] font-[600] block hover:text-[var(--active-color)]">Contact</Link>
                            </li>
                            <li>
                                <Link to="/" className="no-underline text-[16px] py-[4px] text-[black] font-[600] block hover:text-[var(--active-color)]">FAQ</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3">
                        <div className="font-[700] text-[20px] uppercase">
                            Socials
                        </div>
                        <ul className="m-0 flex pt-[20px] pl-0">
                            <li className="pr-[24px] text-[24px] cursor-pointer hover:text-[var(--active-color)]"><i className="fa-brands fa-facebook"></i></li>
                            <li className="pr-[24px] text-[24px] cursor-pointer hover:text-[var(--active-color)]"><i className="fa-brands fa-instagram"></i></li>
                            <li className="pr-[24px] text-[24px] cursor-pointer hover:text-[var(--active-color)]"><i className="fa-brands fa-pinterest"></i></li>
                            <li className="pr-[24px] text-[24px] cursor-pointer hover:text-[var(--active-color)]"><i className="fa-brands fa-tiktok"></i></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="relative pt-[32px]">
                <img className="absolute" src='/line.png' />
                <img className="absolute" src='/line1.png' />
            </div>
        </div>
    )
}

export default Footer