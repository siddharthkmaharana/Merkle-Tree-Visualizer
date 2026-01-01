// src/utils/merkle.js
import CryptoJS from 'crypto-js';

/** Return SHA-256 hex string */
export function sha256Hex(str) {
  return CryptoJS.SHA256(String(str)).toString(CryptoJS.enc.Hex);
}

/**
 * buildMerkleTree(blocks, tamperMode = false, originalLeaves = [])
 * blocks: [{ id, value, changed?, originalValue? }]
 * returns { levels, root, rootTampered }
 */
export function buildMerkleTree(blocks = [], tamperMode = false, originalLeaves = []) {
  if (!blocks || blocks.length === 0) return { levels: [], root: null, rootTampered: false };

  // build leaves
  const leaves = blocks.map((b, i) => {
    const hash = sha256Hex(b.value ?? '');
    const originalHash = originalLeaves[i] ?? null;
    const isTampered = !!(tamperMode && originalHash && originalHash !== hash);
    return {
      hash,
      level: 0,
      index: i,
      data: b.value,
      blockId: b.id,
      isTampered
    };
  });

  const levels = [leaves];
  let current = leaves;
  let level = 0;

  while (current.length > 1) {
    const next = [];
    for (let i = 0; i < current.length; i += 2) {
      const left = current[i];
      let right = current[i + 1];
      if (!right) right = left; // duplicate last on odd length
      const parentHash = sha256Hex(left.hash + right.hash);
      const isTampered = tamperMode && (left.isTampered || right.isTampered);
      next.push({
        hash: parentHash,
        level: level + 1,
        index: Math.floor(i / 2),
        left: { level: left.level, index: left.index },
        right: { level: right.level, index: right.index },
        isTampered
      });
    }
    levels.push(next);
    current = next;
    level++;
  }

  const rootNode = current[0];
  return {
    levels,
    root: rootNode?.hash ?? null,
    rootTampered: !!rootNode?.isTampered
  };
}
