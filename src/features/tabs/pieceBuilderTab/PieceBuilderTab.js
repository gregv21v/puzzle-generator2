import { Panel } from "../../panel/Panel";
import { RightPanel } from "./RightPanel";
import { LeftPanel } from "./LeftPanel";
import { MiddlePanel } from "./MiddlePanel";

import { useDispatch, useSelector } from "react-redux";
import { selectPieces } from "../../pieces/piecesSlice";

import styles from '../../panel/Panel.module.css';
import { selectSelectedPieceId } from "../../selectedPieceId/selectedPieceIdSlice";
import { Menus } from "./Menus";

import Splitter, { SplitDirection } from '@devbookhq/splitter'
import { useState } from "react";
import { selectPanelSizes, setPanelSizes } from "../../panel/panelSlice";


/**
 * PieceBuilderTab - the piece builder tab
 */
export function PieceBuilderTab() {
    const pieces = useSelector(selectPieces);
    const selectedPieceId = useSelector(selectSelectedPieceId)
    const dispatch = useDispatch();
    const sizes = useSelector(selectPanelSizes)

    function handleResize(gutterIdx, allSizes) {
        dispatch(setPanelSizes(allSizes))
    }

    return (
        <div>
            <Menus></Menus>
            <Splitter 
                direction={SplitDirection.Horizontal}
                onResizeFinished={handleResize}
                initialSizes={sizes}
            >
                    <Panel title="Left">
                        <LeftPanel piece={pieces[selectedPieceId]}>
                            
                        </LeftPanel>
                    </Panel>
                        
                    <Panel title="Middle">
                        <MiddlePanel pieces={pieces}>

                        </MiddlePanel>
                    </Panel>
                    
                    <Panel title="Right">
                        <RightPanel piece={pieces[selectedPieceId]}>

                        </RightPanel>
                    </Panel>
                </Splitter>
        </div>  
    )
}