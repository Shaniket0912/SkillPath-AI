import { motion } from 'framer-motion';

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-gray-700 border-t-emerald-400 rounded-full mb-4"
      />
      <p className="text-gray-300 text-sm animate-pulse">{message}</p>
    </div>
  );
}
