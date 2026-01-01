import React from 'react';
import { createRoot } from 'react-dom/client';
import MerkleVisualizer from './Page/MerkleVisualizer';
import './index.css'; // optional, create if you want global styles (see note below)

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <MerkleVisualizer />
  </React.StrictMode>
);
