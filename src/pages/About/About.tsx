import { useTranslation, Trans } from "react-i18next";
import CustomSVG from "../../components/ui/CustomSVG"
import PageBanner from "../../components/ui/PageBanner"
import SmoothText from "../../components/ui/SmoothText"
import SmoothVideo from "../../components/ui/SmoothVideo";
import SmoothImageSlider from "../../components/ui/SmoothImage";

function About() {
    const { t } = useTranslation();
    return (
        <div className="mb-[24px]">
            <PageBanner name="About me" />
            <div className="relative pt-[28px]">
                <img className="absolute" src='/line.png' />
                <img className="absolute" src='/line1.png' />
            </div>
            <div className="container mt-[32px]">
                <div className="row">
                    <div className="flex gap-5 relative justify-center">
                        <CustomSVG className="w-[120px] h-auto absolute top-[-115px] left-[80px]" fillColor="var(--active-color)" />
                        <div className="text-center text-[30px] px-[120px] py-[40px] font-[family-name:var(--font-Gentium)]">
                            <Trans
                                i18nKey="about"
                                components={{
                                    bold: <strong />,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="row pt-[48px]">
                    <div className="flex gap-5">
                        <div className="grow">
                            <SmoothText
                                title={t('random')}
                                text={[t('random1'), t('random2'), t('random3')]}
                            />
                        </div>
                        <SmoothImageSlider images={["/about1.jpg", "/about2.jpg", "/about3.jpg"]} />

                    </div>
                </div>
                        <SmoothVideo video="/Ruonan.mp4" />
                <div className="row bg-[pink] relative" style={{ margin: "36px 0" }}>
                    <div 
                        style={{ padding: "0 200px" }} 
                        className="absolute font-[family-name:var(--font-Gentium)] font-[600] top-0 bottom-0 left-0 right-0 w-fit h-fit my-auto text-[32px] text-center z-[999]"
                    >
                        <i>" {t('quote')} "</i>
                    </div>
                    <svg
                        className="mb-[61px] mx-auto block opacity-50"
                        style={{ marginTop: "83px" }}
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="12.5 19.999 175 160.002"
                        height="264px"
                        width="242px"
                        xmlns="http://www.w3.org/2000/svg"
                        role="presentation"
                        aria-hidden="true"
                        aria-label=""
                    >
                        <g>
                            <path
                                d="M114.733 174.579c45.255-32.506 41.878-73.139 31.072-75.172-9.457-1.355-18.913-4.064-27.018-11.515-15.536-15.576-16.21-40.633-.676-56.208a39.47 39.47 0 0 1 56.064 0c23.641 24.379 12.157 71.787-6.08 101.585-8.105 13.546-19.588 31.154-48.632 46.732l-4.73-5.422z"
                                fill="white"
                                data-color="1"
                            />
                            <path
                                d="M20.442 174.579c45.255-32.506 41.878-73.139 31.071-75.172-9.457-1.355-18.913-4.064-27.018-11.515-15.536-15.577-16.211-40.634-.676-56.209a39.47 39.47 0 0 1 56.064 0c23.641 24.379 12.157 71.787-6.08 101.585C65.697 146.814 54.215 164.422 25.17 180l-4.728-5.421z"
                                fill="white"
                                data-color="1"
                            />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default About