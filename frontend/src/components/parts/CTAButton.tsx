import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';

interface CTAButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const CTAButton = ({ onClick, children, className = "text-midblck font-semibold" }: CTAButtonProps) => (
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

export const useCTAButtons = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  return [
    {
      key: 'get-started',
      onClick: () => navigate('/dashboard'),
      children: 'Get Started'
    },
    {
      key: 'learn-more',
      onClick: () => navigate(isSignedIn ? '/profile' : '/about'),
      children: isSignedIn ? 'Profile' : 'Learn More'
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
};