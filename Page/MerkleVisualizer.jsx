import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Binary, GitBranch } from 'lucide-react';
import CryptoJS from 'crypto-js';
import DataInput from '../src/Components/merkle/DataInput';
import TreeVisualization from '../src/Components/merkle/TreeVisualization';
import VerificationPanel from '../src/Components/merkle/VerificationPanel';
import ThemeToggle from '../src/Components/merkle/ThemeToggle';
import { buildMerkleTree } from '../src/utils/merkle';


export default function MerkleVisualizer() {
  const [blocks, setBlocks] = useState([
    { id: 1, value: 'Tx1' },
    { id: 2, value: 'Tx2' },
    { id: 3, value: 'Tx3' },
    { id: 4, value: 'Tx4' }
  ]);
  
  const [tamperMode, setTamperMode] = useState(false);
  const [originalHashes, setOriginalHashes] = useState({ leaves: [], root: null });
  const [verifyIndex, setVerifyIndex] = useState(null);
  const [isDark, setIsDark] = useState(true);

  // Calculate current root hash
  const currentRoot = useMemo(() => {
    if (blocks.length === 0) return null;

    const calculateHash = (data) => CryptoJS.SHA256(data).toString();
    
    let currentLevel = blocks.map(block => calculateHash(block.value));

    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || left;
        nextLevel.push(calculateHash(left + right));
      }
      currentLevel = nextLevel;
    }

    return currentLevel[0];
  }, [blocks]);

  // Store original state when tamper mode is enabled
  useEffect(() => {
    if (tamperMode && !originalHashes.root) {
      const calculateHash = (data) => CryptoJS.SHA256(data).toString();
      const leaves = blocks.map(block => calculateHash(block.value));
      
      setOriginalHashes({
        leaves,
        root: currentRoot
      });
    }
    
    if (!tamperMode) {
      setOriginalHashes({ leaves: [], root: null });
    }
  }, [tamperMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#0a0a0a] text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? '#1a1a1a' : '#e5e7eb'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#2a2a2a' : '#d1d5db'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#3a3a3a' : '#9ca3af'};
        }
      `}</style>

      {/* Header */}
      <div className={`border-b transition-colors duration-300 ${
        isDark 
          ? 'border-gray-900 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]' 
          : 'border-gray-200 bg-gradient-to-b from-white to-gray-50'
      }`}>
        <div className="max-w-screen-2xl mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88] to-[#00cc70] rounded-xl blur-xl opacity-30"></div>
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-[#00ff88]/20 to-[#00cc70]/10 border border-[#00ff88]/30">
                <GitBranch className="w-8 h-8 text-[#00ff88]" />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                Merkle Tree Visualizer
              </h1>
              <p className={`text-sm font-mono mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Interactive Blockchain Data Integrity Demo
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-300'
              }`}>
                <Binary className="w-4 h-4 text-[#00ff88]" />
                <span className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>SHA-256</span>
              </div>
              <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Data Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className={`sticky top-6 p-6 rounded-xl border shadow-2xl transition-colors duration-300 ${
              isDark 
                ? 'bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-gray-800' 
                : 'bg-gradient-to-b from-white to-gray-50 border-gray-300'
            }`}>
              <DataInput 
                blocks={blocks} 
                setBlocks={setBlocks}
                tamperMode={tamperMode}
                isDark={isDark}
              />
            </div>
          </motion.div>

          {/* Center - Tree Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className={`p-6 rounded-xl border shadow-2xl min-h-[600px] transition-colors duration-300 ${
              isDark 
                ? 'bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-gray-800' 
                : 'bg-gradient-to-b from-white to-gray-50 border-gray-300'
            }`}>
              <div className={`flex items-center gap-2 mb-6 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.5)]"></div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Tree Structure</h2>
                <span className={`ml-auto text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Live Update</span>
              </div>
              
              <TreeVisualization 
                blocks={blocks}
                tamperMode={tamperMode}
                originalHashes={originalHashes}
                verifyIndex={verifyIndex}
                isDark={isDark}
              />
            </div>
          </motion.div>

          {/* Right Sidebar - Verification */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className={`sticky top-6 p-6 rounded-xl border shadow-2xl transition-colors duration-300 ${
              isDark 
                ? 'bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-gray-800' 
                : 'bg-gradient-to-b from-white to-gray-50 border-gray-300'
            }`}>
              <VerificationPanel
                tamperMode={tamperMode}
                setTamperMode={setTamperMode}
                originalRoot={originalHashes.root}
                currentRoot={currentRoot}
                verifyIndex={verifyIndex}
                setVerifyIndex={setVerifyIndex}
                blocksCount={blocks.length}
                isDark={isDark}
              />
            </div>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mt-8 p-6 rounded-xl border transition-colors duration-300 ${
            isDark 
              ? 'bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border-gray-800' 
              : 'bg-gradient-to-r from-white to-gray-50 border-gray-300'
          }`}
        >
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>How It Works</h3>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-700'}`}>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88] font-mono font-bold">
                1
              </div>
              <p className="leading-relaxed">
                Each data block is hashed using SHA-256 to create a unique fingerprint (leaf node).
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88] font-mono font-bold">
                2
              </div>
              <p className="leading-relaxed">
                Pairs of hashes are combined and hashed again to create parent nodes, building the tree upward.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88] font-mono font-bold">
                3
              </div>
              <p className="leading-relaxed">
                The final root hash represents all data. Any change propagates up, changing the root and proving tampering.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}