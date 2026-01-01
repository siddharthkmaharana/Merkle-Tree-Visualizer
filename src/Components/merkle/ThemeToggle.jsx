import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ isDark, setIsDark }) {
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
        isDark 
          ? 'bg-[#1a1a1a] border-gray-800 hover:border-gray-700' 
          : 'bg-white border-gray-300 hover:border-gray-400'
      }`}
    >
      <div className="relative w-5 h-5">
        <motion.div
          initial={false}
          animate={{ 
            scale: isDark ? 0 : 1,
            rotate: isDark ? 90 : 0,
            opacity: isDark ? 0 : 1
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Sun className="w-5 h-5 text-orange-500" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ 
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : -90,
            opacity: isDark ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Moon className="w-5 h-5 text-[#00ff88]" />
        </motion.div>
      </div>
      <span className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}