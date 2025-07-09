import { motion, useScroll, useTransform } from 'framer-motion';
import { Home, FileText, Smile } from 'lucide-react';

const LeftProgressBar = ({ isVisible }: { isVisible: boolean }) => {
  const { scrollYProgress } = useScroll();  

  const homeOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  const documentOpacity = useTransform(scrollYProgress, [0.2, 0.6, 0.85], [0.3, 1, 0.3]);
  const smileOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0.3, 1]);

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isVisible ? 0 : '-100%' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="hidden md:flex fixed left-0 top-0 z-50 w-12 h-full bg-lavpink flex-col"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-8">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          style={{ opacity: homeOpacity }}
        >
          <Home className="w-6 h-6 text-midblck" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
          style={{ opacity: documentOpacity }}
        >
          <FileText className="w-6 h-6 text-midblck" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
          style={{ opacity: smileOpacity }}
        >
          <Smile className="w-6 h-6 text-midblck" />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default LeftProgressBar;
