import { motion } from 'framer-motion';
import ImageCarousel from '@/components/parts/ImageCarousel';
import SideCard from '@/components/parts/SideCard';

interface LevelOneProps {
  animationStage: number;
}

const LevelOne = ({ animationStage }: LevelOneProps) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-4 gap-2 h-96 md:h-64 relative z-10"
      initial={{ opacity: 0, y: 0 }}
      animate={{ 
        opacity: animationStage >= 5 ? 1 : 0,
        y: animationStage >= 5 ? 0 : 50
      }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut"
      }}
    >
      <div className="md:col-span-3 h-full">
        <ImageCarousel />
      </div>
      <div className="h-full flex items-stretch">
        <SideCard 
          title="side section card 1" 
          number="01"
          bg="bg-perspink"
        />
      </div>
    </motion.div>
  );
};

export default LevelOne;