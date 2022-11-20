import { useEffect, useState, forwardRef } from "react";
import { Piece } from "../piece/Piece";
import * as d3 from "d3"
import { SelectionBox } from "../selectionBox/SelectionBox";
import { CirclePiece } from "../piece/CirclePiece";
import { dist, getPiecesWithinRect } from "../util/util";
import { addPiece, deselectAllPieces, selectPiecesAction, setSideStart, setSideEnd, addSide, generateSidedPiece, generateLineSide, generateCirclePiece, generateFreePiece } from "../pieces/piecesSlice";
import { useDispatch, useSelector } from 'react-redux';
import { selectTool, setTool } from "../tool/toolSlice";
import { incrementLastPieceId, selectLastPieceId } from "../lastPieceId/lastPieceIdSlice";
import { FreeFormPiece } from "../piece/FreeFormPiece";
import { selectSelectedPieceId } from "../selectedPieceId/selectedPieceIdSlice";

/**
 * CanvasPanel - the panel where all the pieces are drawn to 
 */
export const CanvasPanel = forwardRef(({pieces}, svgRef) => {
    const [startPoint, setStartPoint] = useState([0, 0])
    const [endPoint, setEndPoint] = useState([0, 0])
    const [selectedSideId, setSelectedSideId] = useState(0)
    const [axisAlign, setAxisAlign] = useState(-1) // 0 for x axis, 1 for y axis
    const [mouseIsDown, setMouseIsDown] = useState(false)
    const [newPieceId, setNewPieceId] = useState(-1);
    const [selectionBoxHidden, setSelectionBoxHidden] = useState(true)
    const dispatch = useDispatch()
    const tool = useSelector(selectTool)
    const lastId = useSelector(selectLastPieceId)
    const selectedPieceId = useSelector(selectSelectedPieceId)


    function closeFreeFormPiece() {

        if(newPieceId !== -1) {

            // close the shape
            let piece = pieces[newPieceId]
            let firstSide = piece.sides[0];

            dispatch(addSide({
                pieceId: newPieceId,
                side: generateLineSide(
                    0, 
                    {x: endPoint[0], y: endPoint[1]},
                    {x: firstSide.constraints.startPoint.value.x, y: firstSide.constraints.startPoint.value.y}
                )
            }))

            setNewPieceId(-1);
        }
    }


    function onKeyPress(event) {
        if(event.key === "Enter" && tool === "FreeHandDraw") {
            closeFreeFormPiece();
        }

        switch(event.key) {
            case "s":
                closeFreeFormPiece();
                dispatch(setTool("Selection"))
                break;
            case "x":
                // align the point with the x axis
                setAxisAlign(0)
                break;
            case "y": 
                // align the point with the y axis
                setAxisAlign(1)
                break;
        }
            
    }

    useEffect(() => {
        d3.select(svgRef.current)
            .on("mousedown", (event) => {
                setStartPoint(d3.pointer(event))
                setMouseIsDown(true)
                setSelectionBoxHidden(false)

                // when drawing a free hand piece
                if(newPieceId === -1 && tool === "FreeHandDraw") {
                    let newPiece = generateSidedPiece(lastId+1)
                    newPiece.sides = [generateLineSide(
                        0, 
                        {x: startPoint[0], y: startPoint[1]},
                        {x: endPoint[0], y: startPoint[1]},
                        true
                    )]

                    dispatch(addPiece(newPiece))

                    setNewPieceId(lastId + 1)

                    dispatch(incrementLastPieceId());
                } 
                
            })
            .on("mousemove", (event) => {
                //console.log("mousemove")
                if(mouseIsDown) {
                    console.log("endpoint set")
                    let point = d3.pointer(event);

                    if(axisAlign !== -1)
                        point[axisAlign] = startPoint[axisAlign]
                    setEndPoint(point)
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
                            dispatch(addPiece(generateCirclePiece(
                                lastId+1, 
                                startPoint[0], 
                                startPoint[1],
                                dist(
                                    {x: startPoint[0], y: startPoint[1]}, 
                                    {x: endPoint[0], y: endPoint[1]}
                                )
                            )))

                            dispatch(incrementLastPieceId());
                            break;
                        case "Shape":
                            dispatch(addPiece(generateSidedPiece(
                                lastId+1, 
                                "radius", 
                                dist({x: startPoint[0], y: startPoint[1]}, {x: endPoint[0], y: endPoint[1]}),
                                3,
                                startPoint[0], startPoint[1]
                            )))

                            dispatch(incrementLastPieceId());
                            break;

                        case "Selection": 
                            let pieceIds = getPiecesWithinRect(pieces, {
                                x: startPoint[0],
                                y: startPoint[1],
                                width: Math.abs(endPoint[0] - startPoint[0]),
                                height: Math.abs(endPoint[1] - startPoint[1])
                            })
        
                            dispatch(deselectAllPieces())
                            dispatch(selectPiecesAction(pieceIds))
                            break;
                        case "FreeHandDraw":
                            dispatch(setSideEnd({
                                pieceId: newPieceId,
                                sideId: selectedSideId,
                                constraintId: "endPoint",
                                newValue: {x: endPoint[0], y: endPoint[1]}
                            }))

                            dispatch(setSideStart({
                                pieceId: newPieceId,
                                sideId: selectedSideId,
                                constraintId: "startPoint",
                                newValue: {x: startPoint[0], y: startPoint[1]}
                            }))

                            dispatch(addSide({
                                pieceId: newPieceId,
                                side: generateLineSide(0)
                            }))

                            setSelectedSideId(selectedSideId + 1);
                
                            break;
                            
                        default: break;
                    }
                }
            })
        document.addEventListener("keypress", onKeyPress)

        return () => document.removeEventListener("keypress", onKeyPress)
    }, [pieces, mouseIsDown, startPoint, endPoint, dispatch, selectedPieceId, newPieceId])


    /**
     * renderPieces()
     * @description renders the current pieces
     * @returns returns a rendering of the pieces
     */
    function renderPieces() {
        return Object.values(pieces).map(piece => {
            if(piece.constraints.type.value === "sided") {
                return (
                    <Piece key={piece.id} piece={piece}></Piece>
                )
            } else if(piece.constraints.type.value === "circle") {
                return (
                    <CirclePiece key={piece.id} piece={piece}></CirclePiece>
                )
            } 
        })
    }

    /**
     * renderCurrent()
     * @description renders the current thing
     * @returns the jsx for the current thing being drawn
     */
    function renderCurrent() {
        switch(tool) {
            case "Shape": 
                return <Piece
                    piece={
                        generateSidedPiece(
                            0, 
                            "radius", 
                            dist({x: startPoint[0], y: startPoint[1]}, {x: endPoint[0], y: endPoint[1]}),
                            3,
                            startPoint[0], startPoint[1]
                        )
                    }
                ></Piece>
            case "Circle":
                return <CirclePiece piece={
                    generateCirclePiece(
                        lastId+1,
                        
                        dist({x: startPoint[0], y: startPoint[1]}, {x: endPoint[0], y: endPoint[1]})
                    )
                }> </CirclePiece>
            case "Selection": 
                return <SelectionBox startPoint={startPoint} endPoint={endPoint} hidden={selectionBoxHidden}/>
            default: 
                return "Nothing"
        }
    }

    return (<div>
        <svg ref={svgRef} width="600" height="600" style={{
            border: "solid black 2px"
        }}>
            {renderPieces()}
            {renderCurrent()}
        </svg>
    </div>)    
})



 