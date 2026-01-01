import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import NodeDisplay from './NodeDisplay';
import CryptoJS from 'crypto-js';

export default function TreeVisualization({ blocks, tamperMode, originalHashes, verifyIndex, isDark }) {
  const calculateHash = (data) => {
    return CryptoJS.SHA256(data).toString();
  };

  const buildTree = useMemo(() => {
    if (blocks.length === 0) return { nodes: [], root: null };

    // Calculate leaf hashes
    let currentLevel = blocks.map((block, index) => ({
      hash: calculateHash(block.value),
      label: `Block ${index}`,
      type: 'leaf',
      data: block.value,
      index: index,
      isTampered: tamperMode && originalHashes.leaves[index] && 
                  originalHashes.leaves[index] !== calculateHash(block.value)
    }));

    const allLevels = [currentLevel];

    // Build parent levels
    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || left; // Duplicate if odd number
        
        const combinedHash = calculateHash(left.hash + right.hash);
        const isTampered = tamperMode && (left.isTampered || right.isTampered);
        
        nextLevel.push({
          hash: combinedHash,
          label: `H(${left.label?.split(' ')[1] || i}+${right.label?.split(' ')[1] || i + 1})`,
          type: 'parent',
          left,
          right,
          isTampered
        });
      }
      currentLevel = nextLevel;
      allLevels.push(currentLevel);
    }

    // Mark root
    if (currentLevel.length > 0) {
      currentLevel[0].type = 'root';
    }

    return { 
      levels: allLevels, 
      root: currentLevel[0]?.hash || null,
      rootTampered: currentLevel[0]?.isTampered || false
    };
  }, [blocks, tamperMode, originalHashes]);

  const { levels, root, rootTampered } = buildTree;

  // Check if node is in verification path
  const isInVerificationPath = (node, level, indexInLevel) => {
    if (verifyIndex === null) return false;
    
    if (level === 0) {
      return indexInLevel === verifyIndex;
    }
    
    // Check if this parent node is in the path to verified leaf
    const childIndex = Math.floor(verifyIndex / Math.pow(2, level));
    return indexInLevel === childIndex;
  };

  const renderConnections = () => {
    if (!levels || levels.length < 2) return null;

    const connections = [];
    const levelHeight = 140;
    const baseWidth = 800;

    for (let levelIndex = 0; levelIndex < levels.length - 1; levelIndex++) {
      const currentLevel = levels[levelIndex];
      const nextLevel = levels[levelIndex + 1];
      
      const currentWidth = baseWidth / Math.pow(1.5, levelIndex);
      const nextWidth = baseWidth / Math.pow(1.5, levelIndex + 1);
      
      nextLevel.forEach((parentNode, parentIndex) => {
        const leftChildIndex = parentIndex * 2;
        const rightChildIndex = parentIndex * 2 + 1;
        
        const parentX = (parentIndex + 0.5) * (nextWidth / nextLevel.length);
        const parentY = (levels.length - levelIndex - 1) * levelHeight;
        
        // Left child connection
        if (leftChildIndex < currentLevel.length) {
          const childX = (leftChildIndex + 0.5) * (currentWidth / currentLevel.length);
          const childY = (levels.length - levelIndex) * levelHeight;
          
          const isTampered = parentNode.isTampered;
          
          connections.push(
            <motion.line
              key={`${levelIndex}-${parentIndex}-left`}
              x1={childX}
              y1={childY - 20}
              x2={parentX}
              y2={parentY + 45}
              stroke={isTampered ? '#ff0055' : verifyIndex !== null ? '#00d4ff' : '#00ff88'}
              strokeWidth="2"
              strokeDasharray={isTampered ? "5,5" : "0"}
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: levelIndex * 0.1 }}
            />
          );
        }
        
        // Right child connection
        if (rightChildIndex < currentLevel.length) {
          const childX = (rightChildIndex + 0.5) * (currentWidth / currentLevel.length);
          const childY = (levels.length - levelIndex) * levelHeight;
          
          const isTampered = parentNode.isTampered;
          
          connections.push(
            <motion.line
              key={`${levelIndex}-${parentIndex}-right`}
              x1={childX}
              y1={childY - 20}
              x2={parentX}
              y2={parentY + 45}
              stroke={isTampered ? '#ff0055' : verifyIndex !== null ? '#00d4ff' : '#00ff88'}
              strokeWidth="2"
              strokeDasharray={isTampered ? "5,5" : "0"}
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: levelIndex * 0.1 }}
            />
          );
        }
      });
    }

    return connections;
  };

  if (!levels || levels.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className={`text-center ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          <p className="font-mono">No data blocks to visualize</p>
        </div>
      </div>
    );
  }

  const levelHeight = 140;
  const baseWidth = 800;
  const svgHeight = levels.length * levelHeight + 100;

  return (
    <div className="relative w-full h-full overflow-auto custom-scrollbar">
      <div className="min-w-[800px] p-8">
        <svg width="100%" height={svgHeight} className="mx-auto">
          {renderConnections()}
        </svg>

        <div className="relative" style={{ height: svgHeight }}>
          {levels.map((level, levelIndex) => {
            const levelWidth = baseWidth / Math.pow(1.5, levelIndex);
            const y = (levels.length - levelIndex - 1) * levelHeight;

            return (
              <div
                key={levelIndex}
                className="absolute left-0 right-0 flex justify-center gap-4"
                style={{ 
                  top: `${y}px`,
                  paddingLeft: `${(800 - levelWidth) / 2}px`,
                  paddingRight: `${(800 - levelWidth) / 2}px`
                }}
              >
                {level.map((node, nodeIndex) => (
                  <div 
                    key={nodeIndex}
                    style={{ 
                      flex: 1,
                      maxWidth: `${levelWidth / level.length - 20}px`
                    }}
                    className="flex justify-center"
                  >
                    <NodeDisplay
                      hash={node.hash}
                      label={node.label}
                      type={node.type}
                      isTampered={node.isTampered}
                      isInPath={isInVerificationPath(node, levelIndex, nodeIndex)}
                      level={levels.length - levelIndex - 1}
                      isDark={isDark}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}