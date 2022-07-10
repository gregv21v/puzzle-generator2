import { Panel } from "../../panel/Panel";
import { RightPanel } from "./RightPanel";
import { LeftPanel } from "./LeftPanel";
import { MiddlePanel } from "./MiddlePanel";

import { useSelector } from "react-redux";
import { selectPieces } from "../../pieces/piecesSlice";

import styles from '../../panel/Panel.module.css';
import { selectSelectedPieceId } from "../../selectedPieceId/selectedPieceIdSlice";


/**
 * PieceBuilderTab - the piece builder tab
 */
export function PieceBuilderTab() {
    const pieces = useSelector(selectPieces);
    const selectedPieceId = useSelector(selectSelectedPieceId)

    return (
        <div className={styles.row}>
            <Panel title="Left" style={styles.side}>
                <LeftPanel piece={pieces[selectedPieceId]}>
                    
                </LeftPanel>
            </Panel>
                
            <Panel title="Middle" style={styles.middle}>
                <MiddlePanel pieces={pieces}>

                </MiddlePanel>
            </Panel>
            
            <Panel title="Right" style={styles.side}>
                <RightPanel piece={pieces[selectedPieceId]}>

                </RightPanel>
            </Panel>
            
        </div>
    )
}