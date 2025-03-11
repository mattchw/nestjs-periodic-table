import styles from './ElementCell.module.css';
import { Element } from '@/types/element';

interface ElementCellProps {
  element: Element;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  isHovered: boolean;
  isSelected: boolean;
}

const ElementCell = ({
  element,
  onMouseEnter,
  onMouseLeave,
  onClick,
  isHovered,
  isSelected
}: ElementCellProps) => {
  const {
    atomicNumber,
    symbol,
    name,
    category
  } = element;

  return (
    <div
      className={`
        ${styles.elementCell} 
        ${styles[category]} 
        ${isHovered ? styles.hovered : ''} 
        ${isSelected ? styles.selected : ''}
      `}
      style={{
        gridRow: element.ypos,
        gridColumn: element.xpos
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className={styles.atomicNumber}>{atomicNumber}</div>
      <div className={styles.symbol}>{symbol}</div>
      <div className={styles.name}>{name}</div>
    </div>
  );
};

export default ElementCell; 