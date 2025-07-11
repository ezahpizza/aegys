import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';
import SideCard from '@/components/parts/SideCard';

interface LevelTwoProps {
  animationStage: number;
}

interface CTAButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const CTAButton = ({ onClick, children, className = "text-midblck font-semibold" }: CTAButtonProps) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick?.();
      }
    }}
    className={`w-full h-12 md:h-[27%] bg-magpink rounded-lg flex items-center justify-center md:justify-end md:pr-4 hover:bg-lavpink cursor-pointer transition-colors ${className}`}
  >
    {children}
  </div>
);


const LevelTwo = ({ animationStage }: LevelTwoProps) => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

const ctaButtons = [
  {
    key: 'get-started',
    onClick: () => navigate('/dashboard'),
    children: 'Get Started'
  },
  {
    key: 'learn-more',
    onClick: () => navigate('/AboutPage'),
    children: 'Learn More'
  },
  {
    key: 'auth',
    children: isSignedIn ? (
      <SignOutButton>
        <button className="text-midblck font-semibold hover:bg-lavpink hover:text-midblck">Sign out</button>
      </SignOutButton>
    ) : (
      <SignInButton mode="modal">
        <button className="text-midblck font-semibold hover:bg-lavpink hover:text-midblck">Sign in</button>
      </SignInButton>
    )
  }
];


  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-4 gap-2 h-auto md:h-56 relative z-20"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {/* CTA Block */}
      <motion.div 
        className="order-2 md:order-1 h-full flex flex-col gap-2 font-heading text-xs relative z-20"
        initial={{ opacity: 0, x: 0 }}
        animate={{ 
          opacity: animationStage >= 4 ? 1 : 0,
          x: animationStage >= 4 ? 0 : 50
        }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut"
        }}
      >
        {ctaButtons.map((button) => (
          <CTAButton key={button.key} onClick={button.onClick}>
            {button.children}
          </CTAButton>
        ))}
      </motion.div>

      {/* Logo + Infinite Scroll Combined - z-index: 30 (highest) */}
      <motion.div 
        className="order-1 md:order-2 md:col-span-2 flex flex-col gap-1 items-center justify-center relative z-30"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative w-full h-32 md:h-full flex items-center justify-center px-4">
          {/* Background container that grows behind the logo */}
          <motion.div 
            className="absolute inset-0 bg-white border-2 border-gray-200 rounded-xl"
            initial={{ 
              backgroundColor: 'rgba(255, 255, 255, 0)', 
              borderColor: 'rgba(229, 231, 235, 0)', 
              scale: 0,
              originX: 0.5,
              originY: 0.5
            }}
            animate={{ 
              backgroundColor: animationStage >= 3 ? '#ffffff' : 'rgba(255, 255, 255, 0)',
              borderColor: animationStage >= 3 ? '#e5e7eb' : 'rgba(229, 231, 235, 0)',
              scale: animationStage >= 3 ? 1 : 0
            }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              delay: animationStage >= 3 ? 0.3 : 0
            }}
          />

          
          <motion.img 
            src='/assets/aegys_logo.svg' 
            alt='aegys logo' 
            className="w-64 h-32 md:w-96 md:h-40 object-contain relative z-10"
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={{ 
              scale: animationStage >= 1 ? 0.9 : 1,
              y: animationStage >= 1 ? 10 : 0
            }}
            transition={{ 
              duration: 0.4, 
              ease: "easeInOut"
            }}
          />
        </div>
        <motion.div 
          className="w-full h-6 font-body text-sm md:text-md text-white text-center bg-midblck rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: animationStage >= 3 ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          • never lose track again • 
        </motion.div>
      </motion.div>

      {/* Side Section Card 2 */}
      <motion.div 
        className="order-3 h-44 md:h-[89%] flex items-stretch relative z-20"
        initial={{ opacity: 0, x: 0 }}
        animate={{ 
          opacity: animationStage >= 4 ? 1 : 0,
          x: animationStage >= 4 ? 0 : -50
        }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut"
        }}
      >
        <SideCard 
          title="Keep every bill and warranty organized in one secure, digital hub." 
          number="02"
          bg="bg-raspink"
          textColor="text-white"
        />
      </motion.div>
    </motion.div>
  );
};

export default LevelTwo;