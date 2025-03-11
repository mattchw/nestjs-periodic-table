"use client";

import dynamic from "next/dynamic";
import { Element } from "@/types/element";
import styles from "./AtomicStructure.module.css";

const Sketch = dynamic(() => import("../components/Sketch"), { ssr: false });

interface AtomicStructureProps {
  element: Element;
}

const AtomicStructure = ({ element }: AtomicStructureProps) => {
  return (
    <div className={styles.atomicStructure}>
      <div className={styles.canvasContainer}>
        <Sketch element={element} />
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.proton}></div>
          <span>Nucleus (Z={element.atomicNumber})</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.electron}></div>
          <span>Electrons</span>
        </div>
      </div>
      <div className={styles.info}>
        <p>Electron configuration: {element.electronConfiguration}</p>
      </div>
    </div>
  );
};

export default AtomicStructure; 