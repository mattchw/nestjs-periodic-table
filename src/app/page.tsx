"use client";
import { useState } from 'react';
import styles from './page.module.css';
import PeriodicTable from '@/components/PeriodicTable';
import ElementDetail from '@/components/ElementDetail';
import { Element, ElementCategory } from '@/types/element';

export default function Home() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const categoryColors: Record<ElementCategory, string> = {
    'nonmetal': '#76FF03',
    'noble-gas': '#2979FF',
    'alkali-metal': '#FF5722',
    'alkaline-earth-metal': '#FFAB00',
    'metalloid': '#00BCD4',
    'post-transition-metal': '#8D6E63',
    'transition-metal': '#FF4081',
    'lanthanide': '#7C4DFF',
    'actinide': '#B388FF',
    'halogen': '#00E676'
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Interactive Periodic Table</h1>

      <div className={styles.categoryLegend}>
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className={styles.categoryItem}>
            <div
              className={styles.categoryColor}
              style={{ backgroundColor: color }}
            ></div>
            <span>{category.replace('-', ' ')}</span>
          </div>
        ))}
      </div>

      <div className={styles.tableContainer}>
        <PeriodicTable onElementSelect={setSelectedElement} />
      </div>

      {selectedElement && (
        <div className={styles.detailsContainer}>
          <ElementDetail element={selectedElement} showAtomicStructure={true} />
        </div>
      )}
    </main>
  );
}
