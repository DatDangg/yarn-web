import PageBanner from "../../components/ui/PageBanner"
import SmoothImage from "../../components/ui/SmoothImage"
import SmoothText from "../../components/ui/SmoothText"

function About() {
    return (
        <div className="mb-[24px]">
            <PageBanner name="About me" />
            <div className="relative pt-[28px]">
                <img className="absolute" src='/line.png' />
                <img className="absolute" src='/line1.png' />
            </div>
            <div className="container mt-[32px]">
                <div className="row">
                    <div className="flex gap-5">
                        <SmoothImage img={"/blog1.jpg"} />
                        <div className="grow">
                            <SmoothText 
                                text={`
                                    Hi y'all! I'm Lay, the creator of Wool you be mine, and welcome to my little place in this big world.
                                    
                                `} 
                            />
                        </div>
                    </div>
                </div>
                <div className="row pt-[36px]">
                    <div className="flex gap-5">
                        <div className="grow">
                            <SmoothText 
                                text={`
                                    Some random things about me
                                    
                                `} 
                            />
                        </div>
                        <SmoothImage img={"/blog1.jpg"} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About