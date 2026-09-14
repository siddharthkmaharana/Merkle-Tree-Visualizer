// src/api/client.js
import { buildMerkleTree, sha256Hex } from '../utils/merkle';

/**
 * Standard Merkle Tree Client API
 * Provides methods for hashing, building trees, and proof validation.
 */
export const client = {
  api: {
    /**
     * Compute SHA-256 hash of a string
     * @param {string} data
     * @returns {string} hex hash
     */
    hash: (data) => sha256Hex(data),

    /**
     * Build Merkle Tree levels and root from blocks
     * @param {Array<{id: number|string, value: string}>} blocks
     * @param {boolean} tamperMode
     * @param {Array<string>} originalLeaves
     * @returns {{levels: Array<Array<object>>, root: string|null, rootTampered: boolean}}
     */
    buildTree: (blocks = [], tamperMode = false, originalLeaves = []) =>
      buildMerkleTree(blocks, tamperMode, originalLeaves),

    /**
     * Verify a Merkle proof path against an expected root hash
     * @param {string} leafData - Original leaf value
     * @param {Array<{position: 'left'|'right', hash: string}>} proof - Sibling hashes along path
     * @param {string} expectedRoot - Expected root hash
     * @returns {boolean}
     */
    verifyProof: (leafData, proof = [], expectedRoot) => {
      let currentHash = sha256Hex(leafData);
      for (const step of proof) {
        if (step.position === 'left') {
          currentHash = sha256Hex(step.hash + currentHash);
        } else {
          currentHash = sha256Hex(currentHash + step.hash);
        }
      }
      return currentHash === expectedRoot;
    }
  }
};

export default client;
