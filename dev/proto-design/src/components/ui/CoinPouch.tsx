import { motion } from 'framer-motion';
import coinPouchImage from '@assets/coins/coin-pouch.png';

interface CoinPouchProps {
  onToss: () => void;
  disabled: boolean;
  isOpen: boolean;
  showHint?: boolean;
}

export function CoinPouch({ onToss, disabled, isOpen }: CoinPouchProps) {
  return (
    <motion.button
      onClick={disabled ? undefined : onToss}
      disabled={disabled}
      className={`
        relative w-14 h-14
        flex items-center justify-center
        cursor-pointer
        ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
      `}
      animate={
        isOpen
          ? { scale: 1.2, y: 0 }
          : disabled
            ? { scale: 1, y: 0 }
            : { y: [0, -4, 0], scale: [1, 1.02, 1] }
      }
      transition={
        isOpen
          ? { duration: 0.2 }
          : disabled
            ? { duration: 0.3 }
            : { y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }
      }
      whileHover={disabled ? {} : { scale: 1.1, y: -5 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <motion.img
        src={coinPouchImage}
        alt="코인 주머니"
        className="w-full h-full object-contain"
        style={{
          filter: isOpen
            ? 'drop-shadow(0 0 12px rgba(201, 168, 108, 0.7)) drop-shadow(0 0 6px rgba(201, 168, 108, 0.4))'
            : 'drop-shadow(0 3px 6px rgba(58, 48, 64, 0.4))',
        }}
      />

      

    </motion.button>
  );
}
