import { Link } from 'react-router-dom';
import SplitText from "@/components/parts/SplitText";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="select-none w-full h-56 md:h-72 bg-lavpink pt-8 px-8 flex flex-col items-center justify-end">

            {/* Links section */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-16 mb-6">
                <Link to="/about-creator" className="font-body font-semibold text-midblu text-lg hover:text-raspink transition-colors uppercase">
                    ABOUT THE CREATOR
                </Link>
                <Link to="/about" className="font-body font-semibold text-midblu text-lg hover:text-raspink transition-colors uppercase">
                    ABOUT US
                </Link>
                <Link to="/contact" className="font-body font-semibold text-midblu text-lg hover:text-raspink transition-colors uppercase">
                    CONTACT
                </Link>
            </div>

            {/* Aegys Logo / Text */}
            <div className="text-center overflow-hidden">
                <div className="pb-4">
                    <SplitText
                        text="aegys"
                        className="font-heading text-5xl md:text-[150px] text-midblu font-bold"
                        delay={50}
                        duration={0.8}
                        ease="power3.out"
                        splitType="chars"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.5}
                        rootMargin="0px"
                        textAlign="center"
                        repeat={true}
                    />
                </div>
                <p className="font-body text-gray-600 mt-1 text-sm md:text-base">
                © {currentYear} aegys
                </p>
            </div>
        </div>
    );
};

export default Footer;