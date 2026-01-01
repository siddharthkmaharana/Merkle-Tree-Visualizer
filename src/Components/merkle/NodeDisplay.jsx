import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Shield, AlertTriangle } from 'lucide-react';

export default function NodeDisplay({ hash, label, type, isTampered, isInPath, level, isDark }) {
  const [isHovered, setIsHovered] = useState(false);

  const truncateHash = (hash) => {
    if (!hash) return '...';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`;
  };

  const getNodeColor = () => {
    if (isTampered) return {
      bg: 'bg-[#ff0055]/20',
      border: 'border-[#ff0055]',
      text: 'text-[#ff0055]',
      glow: 'shadow-[0_0_20px_rgba(255,0,85,0.3)]',
      icon: <AlertTriangle className="w-4 h-4" />
    };
    
    if (isInPath) return {
      bg: 'bg-[#00d4ff]/20',
      border: 'border-[#00d4ff]',
      text: 'text-[#00d4ff]',
      glow: 'shadow-[0_0_20px_rgba(0,212,255,0.3)]',
      icon: <Shield className="w-4 h-4" />
    };

    return {
      bg: 'bg-[#00ff88]/10',
      border: 'border-[#00ff88]/50',
      text: 'text-[#00ff88]',
      glow: isHovered ? 'shadow-[0_0_15px_rgba(0,255,136,0.2)]' : '',
      icon: <Shield className="w-4 h-4" />
    };
  };

  const colors = getNodeColor();

  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger asChild>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: level * 0.1 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className={`
            relative px-4 py-3 rounded-lg border-2 cursor-pointer
            transition-all duration-300
            ${colors.bg} ${colors.border} ${colors.glow}
            hover:scale-105
          `}
        >
          {/* Type Badge */}
          <div className="absolute -top-2 -left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0a0a0a] border border-gray-800">
            {colors.icon}
            <span className={`text-[10px] font-mono font-semibold ${colors.text}`}>
              {type === 'root' ? 'ROOT' : type === 'parent' ? 'PARENT' : 'LEAF'}
            </span>
          </div>

          {/* Label */}
          {label && (
            <div className={`text-xs font-mono mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
          )}

          {/* Hash */}
          <div className={`font-mono text-xs font-semibold ${colors.text} tracking-wider`}>
            {truncateHash(hash)}
          </div>

          {/* Animated border effect */}
          <motion.div
            className={`absolute inset-0 rounded-lg ${colors.border} opacity-0`}
            animate={isTampered ? {
              opacity: [0, 0.5, 0],
              scale: [1, 1.05, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </HoverCardTrigger>
      
      <HoverCardContent 
        className={`w-96 p-4 ${isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-300'}`}
        sideOffset={5}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {colors.icon}
            <span className={`text-sm font-semibold ${colors.text}`}>
              {type === 'root' ? 'Merkle Root' : type === 'parent' ? 'Parent Hash' : 'Leaf Hash'}
            </span>
          </div>
          
          {label && (
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              <span className={isDark ? 'text-gray-600' : 'text-gray-500'}>Label: </span>
              <span className="font-mono">{label}</span>
            </div>
          )}
          
          <div className={`text-xs break-all ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
            <span className={isDark ? 'text-gray-600' : 'text-gray-500'}>Full Hash: </span>
            <code className={`font-mono ${colors.text}`}>{hash}</code>
          </div>

          {isTampered && (
            <div className="mt-3 p-2 rounded bg-[#ff0055]/10 border border-[#ff0055]/30 text-xs text-[#ff0055]">
              ⚠️ This node is part of a tampered path
            </div>
          )}

          {isInPath && !isTampered && (
            <div className="mt-3 p-2 rounded bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-xs text-[#00d4ff]">
              ✓ This node is in the verification path
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}