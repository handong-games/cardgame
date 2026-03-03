import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import btnPrimary from '@assets/buttons/btn-primary.png';
import btnSecondary from '@assets/buttons/btn-secondary.png';
import btnDanger from '@assets/buttons/btn-danger.png';

const BUTTON_IMAGES = {
  primary: btnPrimary,
  secondary: btnSecondary,
  danger: btnDanger,
} as const;

type ButtonVariant = keyof typeof BUTTON_IMAGES;

interface GameButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  children: ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'min-w-[100px] px-4 py-1.5 text-xs',
  md: 'min-w-[130px] px-6 py-2.5 text-sm',
  lg: 'min-w-[160px] px-8 py-3 text-base',
} as const;

export function GameButton({
  variant = 'primary',
  children,
  disabled = false,
  size = 'md',
  className = '',
  style,
  ...motionProps
}: GameButtonProps) {
  const bgImage = BUTTON_IMAGES[variant];

  return (
    <motion.button
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05, filter: 'brightness(1.12) saturate(1.1)' }}
      whileTap={disabled ? {} : { scale: 0.96, filter: 'brightness(0.88)' }}
      className={`
        relative font-bold rounded-xl
        bg-cover bg-center bg-no-repeat
        text-white drop-shadow-md
        transition-[filter] duration-150
        ${disabled ? 'cursor-not-allowed grayscale opacity-60' : 'cursor-pointer'}
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: '100% 100%',
        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        ...style,
      }}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
