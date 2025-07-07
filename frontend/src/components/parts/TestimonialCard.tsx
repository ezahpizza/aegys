interface TestimonialCardProps {
    boxBg?: string;
    titleBg?: string;
    paraBg?: string;
    titleText?: string;
    paraText?: string;
}

const TestimonialCard = ({ 
    boxBg = "bg-white", 
    titleBg = "text-blue-900", 
    paraBg = "text-gray-600",
    titleText = "testimonials and content",
    paraText = "User feedback and content blocks showcase the value and trust"
}: TestimonialCardProps) => {
    return (
        <div className={`w-full h-64 md:h-80 ${boxBg} rounded-xl flex items-center justify-center`}>
            <div className="text-center">
                <h3 className={`font-heading text-lg font-semibold ${titleBg}`}>
                    {titleText}
                </h3>
                <p className={`${paraBg} font-body text-md`}>
                    {paraText}
                </p>
            </div>
        </div>
    );
};

export default TestimonialCard;