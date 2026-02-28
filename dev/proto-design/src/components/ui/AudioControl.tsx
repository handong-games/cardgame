import { motion } from 'framer-motion';

interface AudioControlProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export function AudioControl({ isMuted, onToggleMute }: AudioControlProps) {
  return (
    <motion.button
      onClick={onToggleMute}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className="w-7 h-7 rounded-full bg-dark-deep/60 border border-dark-graphite/50 flex items-center justify-center cursor-pointer transition-colors hover:border-gray-400"
      title={isMuted ? '소리 켜기' : '소리 끄기'}
    >
      <span className="text-sm">{isMuted ? '🔇' : '🔊'}</span>
    </motion.button>
  );
}
