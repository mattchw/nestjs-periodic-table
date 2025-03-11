import p5 from "p5";
import { useEffect, useRef } from "react";
import { Element } from "@/types/element";
interface SketchProps {
  element: Element;
}

const Sketch = ({ element }: SketchProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const electronShells = parseElectronConfiguration(element.electronConfiguration, element.atomicNumber);
      // Create a new p5 instance
      const sketch = (p: p5) => {
        const width = 300;
        const height = 300;
        const centerX = width / 2;
        const centerY = height / 2;

        // Dynamic scaling based on atomic number
        const zoomFactor = Math.max(0.4, 1 - (element.atomicNumber / 200)); // Scale down for heavier elements
        const shellSpacingBase = 30 * zoomFactor;
        const nucleusRadius = 20 * zoomFactor;

        // Animation variables
        let angle = 0;

        p.setup = () => {
          p.createCanvas(width, height);
          p.frameRate(30);
          p.colorMode(p.HSB);
        };

        p.draw = () => {
          p.background(0, 0, 10);

          // Draw nucleus
          p.noStroke();
          p.fill(15, 100, 100); // Orange for protons
          p.ellipse(centerX, centerY, nucleusRadius * 2);

          // Draw element symbol in nucleus
          p.fill(0, 0, 100);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(nucleusRadius * 0.9);
          p.text(element.symbol, centerX, centerY);

          // Draw atomic number below nucleus
          p.textSize(nucleusRadius * 0.6);
          p.text(element.atomicNumber, centerX, centerY + nucleusRadius * 1.5);

          // Draw electron shells
          electronShells.forEach((electronCount, shellIndex) => {
            if (electronCount <= 0) return; // Skip empty shells

            // Calculate shell radius with adaptive spacing (shells get closer for higher shells)
            const shellSpacing = shellSpacingBase * (1 - (shellIndex * 0.05));
            const shellRadius = nucleusRadius + ((shellIndex + 1) * shellSpacing);

            // Draw shell orbit
            p.noFill();
            p.stroke(0, 0, 30);
            p.ellipse(centerX, centerY, shellRadius * 2);

            // Calculate electron size based on electron count
            const electronSize = Math.max(2, 5 * zoomFactor * (1 - (electronCount / 50)));

            // Draw electrons
            const baseAngle = angle + (shellIndex * 0.5); // Offset each shell's rotation

            // Distribute electrons evenly
            for (let i = 0; i < electronCount; i++) {
              const electronAngle = baseAngle + ((p.TWO_PI) / electronCount) * i;
              const x = centerX + Math.cos(electronAngle) * shellRadius;
              const y = centerY + Math.sin(electronAngle) * shellRadius;

              p.noStroke();
              p.fill(200, 100, 100); // Blue for electrons
              p.ellipse(x, y, electronSize * 2);
            }

            // Display electron count for this shell
            const textAngle = p.PI / 4; // Position at 45 degrees
            const textX = centerX + Math.cos(textAngle) * shellRadius;
            const textY = centerY + Math.sin(textAngle) * shellRadius;
            p.fill(0, 0, 80);
            p.textSize(8 * zoomFactor);
            p.text(electronCount, textX, textY);
          });

          // Update angle for animation
          angle += 0.01;
        };
      };

      const p5Instance = new p5(sketch, sketchRef.current!);
      return () => p5Instance.remove(); // Cleanup on unmount
    }
  }, [element]);

  return <div ref={sketchRef} />;
};

// Helper function to parse electron configuration and return accurate shell information
const parseElectronConfiguration = (config: string, atomicNumber: number): number[] => {
  // Initialize shells array (K through Q)
  const shells: number[] = [0, 0, 0, 0, 0, 0, 0];

  // If the configuration is empty or invalid, use the atomic number as fallback
  if (!config || config === '') {
    return distributeElectronsByBohrModel(atomicNumber);
  }

  try {
    // Handle noble gas notation
    let normalizedConfig = config;

    // Replace noble gas notation with the corresponding electron configuration
    if (config.includes('[')) {
      const nobleGasMatch = config.match(/\[(.*?)\]/);
      if (nobleGasMatch) {
        const nobleGas = nobleGasMatch[1];

        // Add electrons based on noble gas configuration
        switch (nobleGas) {
          case 'He': // 1s2
            shells[0] = 2;
            break;
          case 'Ne': // [He] 2s2 2p6
            shells[0] = 2;
            shells[1] = 8;
            break;
          case 'Ar': // [Ne] 3s2 3p6
            shells[0] = 2;
            shells[1] = 8;
            shells[2] = 8;
            break;
          case 'Kr': // [Ar] 3d10 4s2 4p6
            shells[0] = 2;
            shells[1] = 8;
            shells[2] = 18;
            shells[3] = 8;
            break;
          case 'Xe': // [Kr] 4d10 5s2 5p6
            shells[0] = 2;
            shells[1] = 8;
            shells[2] = 18;
            shells[3] = 18;
            shells[4] = 8;
            break;
          case 'Rn': // [Xe] 4f14 5d10 6s2 6p6
            shells[0] = 2;
            shells[1] = 8;
            shells[2] = 18;
            shells[3] = 32;
            shells[4] = 18;
            shells[5] = 8;
            break;
        }

        // Remove the noble gas notation from the config for further processing
        normalizedConfig = config.replace(/\[.*?\]/, '').trim();
      }
    }

    // Process the remaining configuration
    // Match patterns like 1s2, 2p6, 3d10, etc.
    const orbitalPattern = /(\d)([spdfg])(\d+)/g;
    let match;

    while ((match = orbitalPattern.exec(normalizedConfig)) !== null) {
      const shellNumber = parseInt(match[1]) - 1; // Convert to 0-indexed
      const electronCount = parseInt(match[3]);

      if (shellNumber >= 0 && shellNumber < shells.length) {
        shells[shellNumber] += electronCount;
      }
    }

    // Verify total electron count matches atomic number
    const totalElectrons = shells.reduce((sum, count) => sum + count, 0);

    if (totalElectrons !== atomicNumber) {
      console.warn(`Electron count mismatch: config gives ${totalElectrons}, atomic number is ${atomicNumber}`);
      // Fall back to Bohr model if there's a mismatch
      return distributeElectronsByBohrModel(atomicNumber);
    }

    return shells;
  } catch (error) {
    console.error("Error parsing electron configuration:", error);
    // Fall back to Bohr model on error
    return distributeElectronsByBohrModel(atomicNumber);
  }
};

// Helper function to distribute electrons according to the Bohr model
const distributeElectronsByBohrModel = (atomicNumber: number): number[] => {
  const shells: number[] = [0, 0, 0, 0, 0, 0, 0];
  let remaining = atomicNumber;

  // Maximum electrons per shell according to 2n² rule
  const maxElectrons = [2, 8, 18, 32, 32, 18, 8];

  for (let i = 0; i < maxElectrons.length && remaining > 0; i++) {
    const shellElectrons = Math.min(remaining, maxElectrons[i]);
    shells[i] = shellElectrons;
    remaining -= shellElectrons;
  }

  return shells;
};

export default Sketch;