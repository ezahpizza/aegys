import { motion } from 'framer-motion';
import TestimonialCard from '@/components/parts/TestimonialCard';

interface LevelThreeProps {
  animationStage: number;
}

const LevelThree = ({ animationStage }: LevelThreeProps) => {
  return (
    <>
      {/* Image Card + Hero Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 md:mb-8 h-auto md:h-[32rem] relative z-10"
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
            <img src='/assets/imgcard.webp' className="w-full h-full object-cover rounded-xl" />
        </div>

        {/* Hero Section */}
        <div className="order-1 md:order-2 md:col-span-3 h-100 md:h-full pt-2">
          <div className="w-full h-full bg-magpink rounded-xl flex flex-col justify-center md:justify-start shadow-lg overflow-hidden">
            <div className="text-center md:text-left p-8">
              <h2 className="font-heading text-xl md:text-5xl text-white font-bold text-center md:text-left">
                  <span className="text-xl md:text-5xl font-script italic font-light">Forget</span> Your Devices.
              </h2>
              <h3 className="mt-6 font-body text-xl md:text-4xl text-white text-center md:text-left">
                  We'll Remember <span className="text-md font-script italic font-light">(For You)</span>.
              </h3>

            </div>

            <div className="mt-2 md:mt-10 m-10">
              <p className="font-body font-semibold text-midblck text-lg text-center md:text-right max-w-none md:max-w-[70%] md:ml-auto">
                Never lose sleep over misplaced warranties or forgotten service dates again. Aegys is your ultimate digital vault, simplifying device ownership by centralizing your bills and warranties, and sending smart alerts right when you need them. 
              </p>
                  <img src='/assets/pentacle.webp' className="w-[15%] h-auto" />
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
              boxBg = "bg-midblu" 
              titleBg = "text-magpink" 
              paraBg = "text-white" 
              titleText = "Sarah, Tech Enthusiast"
              paraText = "Finally, a solution that keeps all my device info in one place! I used to lose warranty papers constantly, but Aegys has saved me hundreds of dollars by reminding me about coverage before it expires."
              />
        </div>
        <TestimonialCard
              boxBg = "bg-lavpink" 
              titleBg = "text-midblck" 
              paraBg = "text-midblu" 
              titleText = "Marcus, IT Manager"
              paraText = "Managing 50+ company devices was a nightmare until Aegys. The smart alerts for maintenance schedules have reduced our downtime by 60%. It's a game-changer for any business."
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
              titleBg = "text-midblck" 
              paraBg = "text-white" 
              titleText = "Jessica, Busy Mom"
              paraText = "With three kids and countless gadgets, I was always forgetting when things were purchased. Aegys keeps everything organized and even reminds me when warranties are about to expire!"
        />
        <div className="hidden md:block md:col-span-3">
          <TestimonialCard
              boxBg = "bg-midblu" 
              titleBg = "text-magpink" 
              paraBg = "text-white" 
              titleText = "David, Small Business Owner"
              paraText = "The digital receipt storage is incredible. No more shoebox of papers! When my laptop needed repair, I had all the documentation ready in seconds. Aegys has streamlined my entire workflow."
          />
        </div>
      </motion.div>
    </>
  );
};

export default LevelThree;
