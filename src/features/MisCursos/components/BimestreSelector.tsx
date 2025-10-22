import { FaLayerGroup } from "react-icons/fa";
import type { Bimestre } from "../../../interfaces/interfaces";
import styles from "../pages/MisCursosDetailPage.module.css";

interface BimestreSelectorProps {
  selectedBimestre: number | null;
  bimestres: Bimestre[];
  onBimestreChange: (bimestreId: number) => void;
}

export const BimestreSelector = ({ 
  selectedBimestre, 
  bimestres, 
  onBimestreChange 
}: BimestreSelectorProps) => {
  return (
    <div className={styles.bimestreSelector}>
      <div className={styles.bimestreLabel}>
        <FaLayerGroup className={styles.bimestreIcon} />
        <span>Bimestre actual:</span>
      </div>
      <div className={styles.selectWrapper}>
        <select 
          value={selectedBimestre || ''} 
          onChange={(e) => onBimestreChange(Number(e.target.value))}
          className={styles.bimestreSelect}
        >
          {bimestres.map((bim: Bimestre) => (
            <option key={bim.id} value={bim.id}>
              Bimestre {bim.numeroBimestre} - {bim.estado.descripcion}
            </option>
          ))}
        </select>
        <div className={styles.selectArrow}></div>
      </div>
    </div>
  );
};
