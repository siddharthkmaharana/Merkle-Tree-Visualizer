import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';

export default function VerificationPanel({ 
  tamperMode, 
  setTamperMode, 
  originalRoot, 
  currentRoot, 
  verifyIndex,
  setVerifyIndex,
  blocksCount,
  isDark
}) {
  const isRootChanged = originalRoot && currentRoot && originalRoot !== currentRoot;

  return (
    <div className="space-y-6">
      {/* Tamper Mode Toggle */}
      <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-300'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#ff0055]" />
            <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Tamper Detection</span>
          </div>
          
          <button
            onClick={() => setTamperMode(!tamperMode)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              tamperMode 
                ? 'bg-gradient-to-r from-[#ff0055] to-[#ff3366]' 
                : 'bg-gray-700'
            }`}
          >
            <motion.div
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
              animate={{ x: tamperMode ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
        
        <p className={`text-xs font-mono leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          {tamperMode 
            ? 'Monitoring enabled. Changes will be highlighted in red.' 
            : 'Enable to detect data tampering and track changes.'}
        </p>
      </div>

      {/* Root Comparison */}
      <AnimatePresence>
        {tamperMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Original Root */}
            <div className="p-4 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-[#00ff88]" />
                <span className="text-xs font-semibold text-[#00ff88] font-mono">ORIGINAL ROOT</span>
              </div>
              <div className={`text-xs font-mono break-all ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                {originalRoot ? `${originalRoot.substring(0, 20)}...${originalRoot.substring(originalRoot.length - 20)}` : 'Not set'}
              </div>
            </div>

            {/* Current Root */}
            <div className={`p-4 rounded-lg transition-all duration-300 ${
              isRootChanged 
                ? 'bg-[#ff0055]/10 border border-[#ff0055]/30 shadow-lg shadow-[#ff0055]/20' 
                : 'bg-[#00ff88]/10 border border-[#00ff88]/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isRootChanged ? (
                  <>
                    <XCircle className="w-4 h-4 text-[#ff0055]" />
                    <span className="text-xs font-semibold text-[#ff0055] font-mono">CURRENT ROOT (TAMPERED)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#00ff88]" />
                    <span className="text-xs font-semibold text-[#00ff88] font-mono">CURRENT ROOT (VALID)</span>
                  </>
                )}
              </div>
              <div className={`text-xs font-mono break-all ${isRootChanged ? 'text-[#ff0055]' : isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                {currentRoot ? `${currentRoot.substring(0, 20)}...${currentRoot.substring(currentRoot.length - 20)}` : 'Not set'}
              </div>
            </div>

            {/* Tamper Alert */}
            {isRootChanged && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg bg-[#ff0055]/20 border border-[#ff0055] flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-[#ff0055] mt-0.5 flex-shrink-0" />
                <div className="text-xs text-[#ff0055]">
                  <strong className="font-semibold">Data Integrity Compromised!</strong>
                  <p className="mt-1 text-[#ff0055]/80">The Merkle root has changed, indicating that data has been modified.</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Section */}
      <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-300'}`}>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-[#00d4ff]" />
          <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Merkle Proof</span>
        </div>
        
        <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          Select a block to highlight its verification path to the root.
        </p>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: blocksCount }, (_, i) => (
            <Button
              key={i}
              onClick={() => setVerifyIndex(verifyIndex === i ? null : i)}
              variant="outline"
              size="sm"
              className={`font-mono text-xs transition-all duration-300 ${
                verifyIndex === i
                  ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/30'
                  : isDark 
                    ? 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              Block {i}
            </Button>
          ))}
        </div>

        {verifyIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-xs text-[#00d4ff]"
          >
            ✓ Showing verification path for Block {verifyIndex}
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-300'}`}>
        <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.5)]"></div>
            <span className={`font-mono ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Valid / Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff0055] shadow-[0_0_10px_rgba(255,0,85,0.5)]"></div>
            <span className={`font-mono ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Tampered / Changed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.5)]"></div>
            <span className={`font-mono ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Verification Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}