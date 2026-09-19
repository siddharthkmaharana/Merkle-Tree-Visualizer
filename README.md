# Merkle Tree Visualizer

<p align="center">
  <strong>An Interactive Web-Based Framework for Visualizing Cryptographic Data Integrity</strong>
</p>

<p align="center">
  Visualize how data is hashed, combined, and verified through a Merkle Tree.
  Designed for learning, experimentation, blockchain concepts, and cryptographic
  data-integrity research.
</p>

<p align="center">

![GitHub License](https://img.shields.io/github/license/siddharthkmaharana/Merkle-Tree-Visualizer)
![GitHub Stars](https://img.shields.io/github/stars/siddharthkmaharana/Merkle-Tree-Visualizer)
![GitHub Forks](https://img.shields.io/github/forks/siddharthkmaharana/Merkle-Tree-Visualizer)
![GitHub Issues](https://img.shields.io/github/issues/siddharthkmaharana/Merkle-Tree-Visualizer)
![GitHub Last Commit](https://img.shields.io/github/last-commit/siddharthkmaharana/Merkle-Tree-Visualizer)

</p>

---

## Overview

**Merkle Tree Visualizer** is an interactive web application developed to demonstrate how **Merkle Trees** can be used to verify data integrity using cryptographic hash functions.

Instead of representing the Merkle Tree only as a mathematical or theoretical structure, this project provides a visual environment where users can observe the relationship between:

- Input data
- Individual data hashes
- Parent hashes
- Intermediate nodes
- Merkle Root
- Data modification
- Integrity verification

The project is intended for **educational, research, cryptography, and blockchain-related use cases**.

---

## Why Merkle Trees?

A Merkle Tree provides an efficient way to represent and verify the integrity of a collection of data.

Each piece of input data is converted into a cryptographic hash. Pairs of hashes are then combined and hashed again until a single hash remains at the top of the tree — the **Merkle Root**.

The Merkle Root acts as a compact representation of the integrity of the underlying dataset.

If even a small portion of the original data changes, the resulting hashes propagate through the tree and produce a different Merkle Root.

### Simplified Structure

```text
                         Merkle Root
                              |
                    +---------+---------+
                    |                   |
                 Hash AB             Hash CD
                  /   \               /   \
                 /     \             /     \
             Hash A   Hash B      Hash C   Hash D
                |        |            |        |
             Data A    Data B       Data C    Data D