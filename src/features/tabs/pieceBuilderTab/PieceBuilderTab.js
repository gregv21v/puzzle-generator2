import { Panel } from "../../panel/Panel";
import { RightPanel } from "./RightPanel";
import { LeftPanel } from "./LeftPanel";
import { MiddlePanel } from "./MiddlePanel";

import { useDispatch, useSelector } from "react-redux";
import { selectPieces } from "../../pieces/piecesSlice";

import { selectSelectedPiecesId } from "../../selectedPiecesId/selectedPiecesIdSlice";
import { Menus } from "../../menus/Menus";

import Splitter, { SplitDirection } from '@devbookhq/splitter'
import { selectPanelSizes, setPanelSizes } from "../../panel/panelSlice";
import { useRef } from "react";
import { useEffect } from "react";
import { setAxisLock } from "../../axisLock/axisLockSlice";


/**
 * PieceBuilderTab - the piece builder tab
 */
export function PieceBuilderTab() {
    const pieces = useSelector(selectPieces);
    const selectedPiecesId = useSelector(selectSelectedPiecesId)
    const dispatch = useDispatch();
    const sizes = useSelector(selectPanelSizes)
    const canvasRef = useRef(null)

    function onKeyPress(event) {
        switch(event.key) {
            case "x":
                // align the point with the x axis
                dispatch(setAxisLock("x"))
                break;
            case "y": 
                // align the point with the y axis
                dispatch(setAxisLock("y"))
                break;
            case "n":
                dispatch(setAxisLock("n"))
                break;
            default: break;
        }    
    }

    useEffect(() => {
        document.addEventListener("keypress", onKeyPress)

        return () => document.removeEventListener("keypress", onKeyPress)
    })


    function handleResize(gutterIdx, allSizes) {
        dispatch(setPanelSizes(allSizes))
    }

    

    return (
        <div>
            <Menus canvasRef={canvasRef}></Menus>
            <Splitter 
                direction={SplitDirection.Horizontal}
                onResizeFinished={handleResize}
                initialSizes={sizes}
            >
                    <Panel title="Left">
                        <LeftPanel piece={pieces[selectedPiecesId[0]]}>
                            
                        </LeftPanel>
                    </Panel>
                        
                    <Panel title="Middle">
                        <MiddlePanel ref={canvasRef} pieces={pieces}>

                        </MiddlePanel>
                    </Panel>
                    
                    <Panel title="Right">
                        <RightPanel piece={pieces[selectedPiecesId[0]]}>

                        </RightPanel>
                    </Panel>
                </Splitter>
        </div>  
    )
}