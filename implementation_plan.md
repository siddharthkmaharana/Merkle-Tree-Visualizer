# Fix Merkle Tree Visualization Alignment

The current visualization has disconnected branches because the SVG line coordinates do not match the Flexbox layout used for the nodes. The nodes use `gap-4` spacing and flex centering, while the lines use simple division logic. Additionally, the Y-coordinates for the lines seem to be calculated with an off-by-one level error.

## User Review Required

> [!IMPORTANT]
> This change modifies how the tree connections are calculated. It assumes the node spacing is `gap-4` (16px) and that nodes are centered. If the CSS changes, this logic will need to be updated.

## Proposed Changes

### Merkle Tree Component

#### [MODIFY] [TreeVisualization.jsx](file:///c:/Users/sidsm/Markle%20Tree/src/Components/merkle/TreeVisualization.jsx)

- Rewrite `renderConnections` function.
- Implement X-coordinate logic that mirrors the Flexbox layout:
    - Base width: 800px.
    - Accounting for `gap: 16px` between nodes.
    - Calculating exact center of each node based on effective width and gaps.
- Fix Y-coordinate logic:
    - Ensure lines connect `levelIndex` (Child) to `levelIndex + 1` (Parent).
    - Adjust vertical offsets to connect Top of Child to Bottom of Parent.

## Verification Plan

### Manual Verification
- Start the app.
- Add multiple blocks (at least 4) to form a multi-level tree.
- Verify that green lines connect the center of the Child node to the center of the Parent node.
- Verify that lines are attached to the nodes and not floating above/below.
