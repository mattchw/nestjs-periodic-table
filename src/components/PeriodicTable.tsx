"use client";
import { useState } from 'react';
import styles from './PeriodicTable.module.css';
import { periodicTableData } from '@/data/periodicTableData';
import ElementCell from '@/components/ElementCell';
import { Element } from '@/types/element';

interface PeriodicTableProps {
  onElementSelect: (element: Element | null) => void;
}

const PeriodicTable = ({ onElementSelect }: PeriodicTableProps) => {
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const handleElementHover = (element: Element) => {
    setHoveredElement(element);
  };

  const handleElementLeave = () => {
    setHoveredElement(null);
  };

  const handleElementClick = (element: Element) => {
    if (selectedElement?.atomicNumber === element.atomicNumber) {
      setSelectedElement(null);
      onElementSelect(null);
    } else {
      setSelectedElement(element);
      onElementSelect(element);
    }
  };

  return (
    <div className={styles.periodicTableContainer}>
      <div className={styles.periodicTable}>
        {periodicTableData.map((element) => (
          <ElementCell
            key={element.atomicNumber}
            element={element}
            onMouseEnter={() => handleElementHover(element)}
            onMouseLeave={handleElementLeave}
            onClick={() => handleElementClick(element)}
            isHovered={hoveredElement?.atomicNumber === element.atomicNumber}
            isSelected={selectedElement?.atomicNumber === element.atomicNumber}
          />
        ))}
      </div>

      {hoveredElement && !selectedElement && (
        <div
          className={styles.tooltip}
          style={{
            left: `${Math.min(Math.max(hoveredElement.xpos * 64, 100), window.innerWidth - 100)}px`,
            top: `${hoveredElement.ypos * 64 + 30}px`
          }}
        >
          <div className={styles.tooltipContent}>
            <strong>{hoveredElement.name}</strong>
            <p>Atomic Number: {hoveredElement.atomicNumber}</p>
            <p>Click for details</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodicTable; 