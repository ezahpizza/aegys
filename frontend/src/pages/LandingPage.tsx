import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/sections/Footer';
import LeftProgressBar from '@/components/parts/LeftProgressBar';
import LevelOne from '@/components/sections/LevelOne';
import LevelTwo from '@/components/sections/LevelTwo';
import LevelThree from '@/components/sections/LevelThree';

const LandingPage = () => {
  
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timers = [
      setTimeout(() => setAnimationStage(1), 800), // Logo press down
      setTimeout(() => setAnimationStage(2), 1200), // Background spread
      setTimeout(() => setAnimationStage(3), 1800), // Logo block 
      setTimeout(() => setAnimationStage(4), 2200), // Level 2 
      setTimeout(() => setAnimationStage(5), 2800), // Level 1 & 3 
      setTimeout(() => setAnimationStage(6), 3200), // position bar 
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <motion.div 
        className="select-none min-h-screen py-2 md:py-4 px-2 md:px-3 relative"
        initial={{ backgroundColor: '#F8B7E1' }} // lavpink
        animate={{ 
          backgroundColor: animationStage >= 2 ? '#190E4F' : '#F8B7E1' // midblu after stage 2
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
      
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: animationStage >= 6 ? 0 : '-100%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute top-0 left-0 h-full"
        >
          <LeftProgressBar isVisible={animationStage >= 6} />
        </motion.div>

        <div className="max-w-5xl md:max-w-7xl mx-auto space-y-1 md:space-y-2">

          {/* Level 1: Image Carousel + Side Section Card 1 */}
          <LevelOne animationStage={animationStage} />

          {/* Level 2: Get Started CTA + Logo/Infinite Scroll + Side Section Card 2 */}
          <LevelTwo animationStage={animationStage} />

          {/* Level 3: Image Card + Hero Section + Testimonials */}
          <LevelThree animationStage={animationStage} />

        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default LandingPage;