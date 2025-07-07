import { useState, useEffect } from 'react';
import SpotlightCard from '@/components/ui/SpotlightCard'; 

const ImageCarousel = () => {
    const images = [
        'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=300&fit=crop',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=300&fit=crop',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=300&fit=crop'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden rounded-xl bg-raspink">
            <div className="flex w-full h-full gap-1 p-1">
                {images.map((img, idx) => (
                    <div key={img} className="flex-1 h-full overflow-hidden rounded-xl">
                        <SpotlightCard className="custom-spotlight-card w-full h-full" spotlightColor="rgba(0, 229, 255, 0.2)">
                            <img src={img} className="w-full h-full object-cover" />
                        </SpotlightCard>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;