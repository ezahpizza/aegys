import { motion, useScroll, useTransform } from 'framer-motion';
import { Home, FileText, Smile } from 'lucide-react';

const LeftProgressBar = ({ isVisible }: { isVisible: boolean }) => {
  const { scrollYProgress } = useScroll();  

  const homeOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  const documentOpacity = useTransform(scrollYProgress, [0.2, 0.35, 0.85], [0.3, 1, 0.3]);
  const smileOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0.3, 1]);

  const smoothScrollToSection = (progress: number) => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetPosition = documentHeight * progress;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1500; // 1.5 seconds for slow, smooth scroll
    let start: number | null = null;

    const animateScroll = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation (ease-in-out)
      const easeInOutQuart = (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      const easedPercentage = easeInOutQuart(percentage);
      
      window.scrollTo(0, startPosition + distance * easedPercentage);
      
      if (percentage < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isVisible ? 0 : '-100%' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="hidden md:flex fixed left-0 top-0 z-50 w-12 h-full bg-lavpink flex-col"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-8">

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          style={{ opacity: homeOpacity }}
          onClick={() => smoothScrollToSection(0)}
          className="hover:scale-110 transition-transform duration-200"
        >
          <Home className="w-6 h-6 text-midblck" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
          style={{ opacity: documentOpacity }}
          onClick={() => smoothScrollToSection(0.35)}
          className="hover:scale-110 transition-transform duration-200"
        >
          <FileText className="w-6 h-6 text-midblck" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
          style={{ opacity: smileOpacity }}
          onClick={() => smoothScrollToSection(1)}
          className="hover:scale-110 transition-transform duration-200"
        >
          <Smile className="w-6 h-6 text-midblck" />
        </motion.button>

      </div>
    </motion.div>
  );
};

export default LeftProgressBar;
