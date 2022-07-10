import { useEffect, useRef, useState } from "react";
import { Piece } from "../piece/Piece";
import * as d3 from "d3"
import { SelectionBox } from "../selectionBox/SelectionBox";
import { getPiecesWithinRect } from "../util/util";
import { deselectAllPieces, selectPiecesAction } from "../pieces/piecesSlice";
import { useDispatch } from 'react-redux';

/**
 * CanvasPanel - the panel where all the pieces are drawn to 
 */
export function CanvasPanel({pieces}) {
    const svgRef = useRef(null)
    const [startPoint, setStartPoint] = useState([0, 0])
    const [endPoint, setEndPoint] = useState([0, 0])
    const [mouseIsDown, setMouseIsDown] = useState(false)
    const [selectionBoxHidden, setSelectionBoxHidden] = useState(true)
    const dispatch = useDispatch()


    useEffect(() => {
        d3.select(svgRef.current)
            .on("mousedown", (event) => {
                console.log("mousedown")
                setStartPoint(d3.pointer(event))
                setMouseIsDown(true)
                setSelectionBoxHidden(false)
            })
            .on("mousemove", (event) => {
                //console.log("mousemove")
                if(mouseIsDown) {
                    console.log("endpoint set")
                    setEndPoint(d3.pointer(event))
                }
            })
            .on("mouseup", (event) => {
                console.log("mouseUp");
                if(mouseIsDown) {
                    setMouseIsDown(false)
                    setSelectionBoxHidden(true)

                
                    // select the pieces within the selection box

                    let pieceIds = getPiecesWithinRect(pieces, {
                        x: startPoint[0],
                        y: startPoint[1],
                        width: Math.abs(endPoint[0] - startPoint[0]),
                        height: Math.abs(endPoint[1] - startPoint[1])
                    })

                    dispatch(deselectAllPieces())
                    dispatch(selectPiecesAction(pieceIds))
                    
                }
            })
    }, [pieces, mouseIsDown, startPoint, endPoint, dispatch])


    return (
        <div>
            <svg ref={svgRef} width="600" height="600" style={{
                border: "solid black 2px"
            }}>
                {
                    pieces.map(piece => {
                        return (
                            <Piece key={piece.id} piece={piece}></Piece>
                        )
                    })
                }
                <SelectionBox startPoint={startPoint} endPoint={endPoint} hidden={selectionBoxHidden}/>
            </svg>
        </div>
            
    )
}
 