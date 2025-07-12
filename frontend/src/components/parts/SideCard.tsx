interface SideCardProps {
    title: string;
    number: string;
    bg: string;
    textColor: string;
}

const SideCard = ({ title, number, bg, textColor }: SideCardProps) => {
    return (
        <div className={`w-full h-full rounded-xl ${bg} p-3 md:p-4 flex flex-col justify-between shadow-md`}>
            <div className="text-center md:text-right">
                <span className={`font-body text-xs md:text-sm ${textColor}`}>{number}</span>
            </div>
            <div className="text-center md:text-right">
                <h3 className={`font-heading text-xs md:text-base ${textColor} font-bold`}>
                    {title}
                </h3>
            </div>
        </div>
    );
};

export default SideCard;
