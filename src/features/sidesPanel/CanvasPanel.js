import { useEffect, useRef, useState, forwardRef } from "react";
import { Piece } from "../piece/Piece";
import * as d3 from "d3"
import { SelectionBox } from "../selectionBox/SelectionBox";
import { CirclePiece } from "../piece/CirclePiece";
import { dist, getPiecesWithinRect } from "../util/util";
import { addPiece, createCirclePiece, deselectAllPieces, selectPiecesAction, setPieceConstraints } from "../pieces/piecesSlice";
import { useDispatch, useSelector } from 'react-redux';
import { selectTool } from "../tool/toolSlice";

/**
 * CanvasPanel - the panel where all the pieces are drawn to 
 */
export const CanvasPanel = forwardRef(({pieces}, svgRef) => {
    const [startPoint, setStartPoint] = useState([0, 0])
    const [endPoint, setEndPoint] = useState([0, 0])
    const [mouseIsDown, setMouseIsDown] = useState(false)
    const [selectionBoxHidden, setSelectionBoxHidden] = useState(true)
    const dispatch = useDispatch()
    const tool = useSelector(selectTool)

    useEffect(() => {
        d3.select(svgRef.current)
            .on("mousedown", (event) => {
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

                    switch(tool) {
                        case "Circle": 
                            dispatch(addPiece({
                                    id: 3,
                                    x: startPoint[0],
                                    y: startPoint[1],
                                    color: "blue",
                                    constraints: {
                                        radius: dist({x: startPoint[0], y: startPoint[1]}, {x: endPoint[0], y: endPoint[1]})
                                    }
                            }))
                        case "Selection": 
                            let pieceIds = getPiecesWithinRect(pieces, {
                                x: startPoint[0],
                                y: startPoint[1],
                                width: Math.abs(endPoint[0] - startPoint[0]),
                                height: Math.abs(endPoint[1] - startPoint[1])
                            })
        
                            dispatch(deselectAllPieces())
                            dispatch(selectPiecesAction(pieceIds))
                        default: break;
                    }
                }
            })
    }, [pieces, mouseIsDown, startPoint, endPoint, dispatch])

    return (<div>
        <svg ref={svgRef} width="600" height="600" style={{
            border: "solid black 2px"
        }}>
            {
                pieces.map(piece => {
                    if(piece.type === "sided") {
                        return (
                            <Piece key={piece.id} piece={piece}></Piece>
                        )
                    } else {
                        return (
                            <CirclePiece key={piece.id} piece={piece}></CirclePiece>
                        )
                    }
                })
            }
        {
            (() => {
                switch(tool) {
                    case "Circle":
                        console.log("Circle tool selected");
                        
                        console.log(dist(startPoint, endPoint));
                        return <CirclePiece piece={{
                            id: 3,
                            x: startPoint[0],
                            y: startPoint[1],
                            color: "blue",
                            constraints: {
                                radius: dist({x: startPoint[0], y: startPoint[1]}, {x: endPoint[0], y: endPoint[1]})
                            }
                        }}> </CirclePiece>
                    case "Selection": 
                        return <SelectionBox startPoint={startPoint} endPoint={endPoint} hidden={selectionBoxHidden}/>
                    default: 
                        return "Nothing"
                }
            })()
        }
        </svg>
    </div>)    
})



 