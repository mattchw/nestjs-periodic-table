
import styles from './ElementDetail.module.css';
import AtomicStructure from '@/components/AtomicStructure';
import { Element } from '@/types/element';

interface ElementDetailProps {
  element: Element;
  showAtomicStructure?: boolean;
}

const ElementDetail = ({ element }: ElementDetailProps) => {
  const {
    name,
    atomicNumber,
    symbol,
    atomicMass,
    electronConfiguration,
    electronegativity,
    atomicRadius,
    ionizationEnergy,
    density,
    meltingPoint,
    boilingPoint,
    discoveredBy,
    category,
    description
  } = element;

  return (
    <div className={styles.elementDetail}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={`${styles.symbol} ${styles[category]}`}>{symbol}</div>
          <div className={styles.info}>
            <h2>{name}</h2>
            <p>Atomic Number: {atomicNumber}</p>
            <p>Atomic Mass: {atomicMass}</p>
          </div>
        </div>

        <div className={styles.properties}>
          <h3>Properties</h3>
          <p>Electron Configuration: {electronConfiguration}</p>
          <p>Electronegativity: {electronegativity || 'N/A'}</p>
          <p>Atomic Radius: {atomicRadius} pm</p>
          <p>Ionization Energy: {ionizationEnergy} eV</p>
          <p>Density: {density} g/cm³</p>
          <p>Melting Point: {meltingPoint} K</p>
          <p>Boiling Point: {boilingPoint} K</p>
          <p>Category: {category}</p>
          <p>Discovered by: {discoveredBy}</p>
        </div>

        <div className={styles.description}>
          <p>{description}</p>
        </div>

        {/* Removed the toggle button */}
      </div>

      {/* Always show the atomic structure */}
      <div className={styles.animationContainer}>
        <AtomicStructure element={element} />
      </div>
    </div>
  );
};

export default ElementDetail; 