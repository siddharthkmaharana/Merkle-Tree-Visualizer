import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Database } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function DataInput({ blocks, setBlocks, tamperMode, isDark }) {
  const addBlock = () => {
    setBlocks([...blocks, { id: Date.now(), value: `Tx${blocks.length + 1}` }]);
  };

  const removeBlock = (id) => {
    if (blocks.length > 2) {
      setBlocks(blocks.filter(block => block.id !== id));
    }
  };

  const updateBlock = (id, value) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, value } : block
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center gap-3 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#00ff88]/20 to-[#00cc70]/10 border border-[#00ff88]/30">
          <Database className="w-5 h-5 text-[#00ff88]" />
        </div>
        <div>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Data Blocks</h2>
          <p className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{blocks.length} inputs</p>
        </div>
      </div>

      {/* Input Blocks */}
      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border flex items-center justify-center ${
                isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-300'
              }`}>
                <span className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{index}</span>
              </div>
              
              <div className={`relative rounded-lg border transition-all duration-300 ${
                block.changed && tamperMode 
                  ? 'bg-[#ff0055]/10 border-[#ff0055]/50 shadow-lg shadow-[#ff0055]/20' 
                  : isDark 
                    ? 'bg-[#1a1a1a] border-gray-800 hover:border-gray-700'
                    : 'bg-white border-gray-300 hover:border-gray-400'
              }`}>
                <Input
                  value={block.value}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  className={`bg-transparent border-0 font-mono text-sm focus-visible:ring-0 pr-12 ${
                    isDark ? 'text-gray-200 placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'
                  }`}
                  placeholder="Enter data..."
                />
                
                {blocks.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBlock(block.id)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff0055]/20 hover:text-[#ff0055]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Button */}
      <Button
        onClick={addBlock}
        className="w-full bg-gradient-to-r from-[#00ff88]/20 to-[#00cc70]/10 hover:from-[#00ff88]/30 hover:to-[#00cc70]/20 text-[#00ff88] border border-[#00ff88]/30 hover:border-[#00ff88]/50 transition-all duration-300 font-mono"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Block
      </Button>
    </div>
  );
}