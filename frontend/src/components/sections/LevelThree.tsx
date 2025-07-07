import { motion } from 'framer-motion';
import TestimonialCard from '@/components/parts/TestimonialCard';
import TiltedCard from '@/components/ui/TiltedCard';


interface LevelThreeProps {
  animationStage: number;
}

const LevelThree = ({ animationStage }: LevelThreeProps) => {
  return (
    <>
      {/* Image Card + Hero Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 md:mb-8 h-auto md:h-[36rem] relative z-10"
        initial={{ opacity: 0, y: 0 }}
        animate={{ 
          opacity: animationStage >= 5 ? 1 : 0,
          y: animationStage >= 5 ? 0 : -50
        }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut",
          delay: animationStage >= 5 ? 0.2 : 0
        }}
      >
        {/* Image Card */}
        <div className="order-2 md:order-1 h-96 md:h-[80%] pt-2 flex items-stretch rounded-xl">
            <img src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=300&fit=crop' className="w-full h-full object-cover rounded-xl" />
        </div>

        {/* Hero Section */}
        <div className="order-1 md:order-2 md:col-span-3 h-96 md:h-full pt-2">
          <div className="w-full h-full bg-magpink rounded-xl flex flex-col justify-center md:justify-start shadow-lg overflow-hidden">
            <div className="text-center md:text-left p-8">
              <h2 className="font-heading text-xl md:text-5xl text-white font-bold text-center md:text-left">
                 hero section Lorem ipsum 
              </h2>
            </div>

            <div className="mt-2 md:mt-10 p-2">
              <p className="font-body font-semibold text-midblu text-lg text-center md:text-right max-w-none md:max-w-[70%] md:ml-auto">
                Description text displayed when user scrolls and bento div expands vertically downward Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus eligendi alias, recusandae nihil tenetur quod commodi ut sunt dolor, repellendus vitae labore, dicta voluptates! Repudiandae, labore distinctio. Veritatis consequatur 
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Level 1 */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-4 md:pt-8 md:py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationStage >= 5 ? 1 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut",
          delay: animationStage >= 5 ? 0.8 : 0
        }}
      >
        <div className="hidden md:block md:col-span-3">
          <TestimonialCard 
              boxBg = "bg-black" 
              titleBg = "text-magpink" 
              paraBg = "text-white" 
              titleText = "lorem4fgsdabih"
              paraText = "WDUIYFBGVfasbgvadfinbiadfnbpunadf"
              />
        </div>
        <TestimonialCard
              boxBg = "bg-lavpink" 
              titleBg = "text-midblu" 
              paraBg = "text-black" 
              titleText = "lorem4fgsdabih"
              paraText = "WDUIYFBGVfasbgvadfinbiadfnbpunadf"
        />
      </motion.div>

      {/* Testimonials Level 2 */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-2 py-4 md:py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationStage >= 5 ? 1 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut",
          delay: animationStage >= 5 ? 1.0 : 0
        }}
      >
        <TestimonialCard
              boxBg = "bg-magpink" 
              titleBg = "text-midblu" 
              paraBg = "text-white" 
              titleText = "lorem4fgsdabih"
              paraText = "WDUIYFBGVfasbgvadfinbiadfnbpunadf"
        />
        <div className="hidden md:block md:col-span-3">
          <TestimonialCard
              boxBg = "bg-black" 
              titleBg = "text-magpink" 
              paraBg = "text-white" 
              titleText = "lorem4fgsdabih"
              paraText = "WDUIYFBGVfasbgvadfinbiadfnbpunadf"
          />
        </div>
      </motion.div>
    </>
  );
};

export default LevelThree;