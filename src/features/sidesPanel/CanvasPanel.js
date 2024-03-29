import { useEffect, useState, forwardRef } from "react";
import { Piece } from "../piece/Piece";
import * as d3 from "d3"
import { SelectionBox } from "../selectionBox/SelectionBox";
import { CirclePiece } from "../piece/CirclePiece";
import { dist, getPiecesWithinRect } from "../util/util";
import { addPiece, selectPiecesAction, addSide, generateSidedPiece, generateLineSide, generateCirclePiece, generateFreePiece, generateRectangularPiece } from "../pieces/piecesSlice";
import { useDispatch, useSelector } from 'react-redux';
import { selectTool, setTool } from "../tool/toolSlice";
import { incrementLastPieceId, selectLastPieceId } from "../lastPieceId/lastPieceIdSlice";
import { setSelectedPiecesId, selectSelectedPiecesId } from "../selectedPiecesId/selectedPiecesIdSlice";
import { Piece2 } from "../piece/Piece2";
import { OpenPiece } from "../piece/OpenPiece";

/**
 * CanvasPanel - the panel where all the pieces are drawn to 
 */
export const CanvasPanel = forwardRef(({pieces}, svgRef) => {
    const [startPoint, setStartPoint] = useState([0, 0])
    const [endPoint, setEndPoint] = useState([0, 0])
    const [axisAlign, setAxisAlign] = useState(-1) // 0 for x axis, 1 for y axis
    const [mouseIsDown, setMouseIsDown] = useState(false)
    const [newPieceId, setNewPieceId] = useState(-1);
    const [selectionBoxHidden, setSelectionBoxHidden] = useState(true)
    const dispatch = useDispatch()
    const tool = useSelector(selectTool)
    const lastId = useSelector(selectLastPieceId)
    const selectedPieceId = useSelector(selectSelectedPiecesId)[0]
    const [lastSideId, setLastSideId] = useState(0);
    const [currentPiece, setCurrentPiece] = useState(generateFreePiece(0));

    


    /**
     * closeFreeFormPiece()
     * @description closes the path of the current free form piece
     * 
     */
    function closeFreeFormPiece() {
        if(newPieceId !== -1) {
            setNewPieceId(-1);

            // recalculate the center of the piece
            let piece = {...currentPiece}

            
            // add up the x and y coordinates of each side
            let xTotal = 0;
            let yTotal = 0;
            for (const side of Object.values(piece.sides)) {
                xTotal += side.constraints.startPoint.value.x;
                yTotal += side.constraints.startPoint.value.y;
            }

            piece.constraints.center.value = {
                x: xTotal / Object.keys(piece.sides).length,
                y: yTotal / Object.keys(piece.sides).length
            } 

            // recalculate the position of each side
            for (const key of Object.keys(piece.sides)) {
                piece.sides[key].constraints.startPoint.value.x -= piece.constraints.center.value.x
                piece.sides[key].constraints.startPoint.value.y -= piece.constraints.center.value.y
            }

            // add the piece to the list of pieces
            dispatch(addPiece(piece))

            dispatch(incrementLastPieceId())
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
            default: break;
        }
            
    }

    useEffect(() => {
        d3.select(svgRef.current)
            .on("mousedown", (event) => {
                let point = d3.pointer(event);
                setStartPoint(d3.pointer(event))
                setMouseIsDown(true)
                setSelectionBoxHidden(false)

                // Create a new free form piece with its first side
                if(newPieceId === -1 && tool === "FreeHandDraw") {

                    // create the new piece with two sides
                    let newPiece = generateFreePiece(lastId+1, true)
                    newPiece.order = [0, 1]
                    newPiece.sides[lastSideId] = generateLineSide(lastSideId, {x: point[0], y: point[1]})
                    newPiece.sides[lastSideId+1] = generateLineSide(lastSideId+1, {x: point[0], y: point[1]})

                    
                    // update the current piece
                    setCurrentPiece(newPiece)

                    setLastSideId(lastSideId+1)

                    setNewPieceId(lastId + 1)
                } 
                
            })
            .on("mousemove", (event) => {
                //console.log("mousemove")
                if(mouseIsDown) {
                    let point = d3.pointer(event);

                    if(axisAlign !== -1)
                        point[axisAlign] = startPoint[axisAlign]
                    setEndPoint(point)

                    if(tool === "FreeHandDraw") {
                        // update the end side
                        setCurrentPiece(state => {
                            let sides = {...state.sides}
                            sides[lastSideId].constraints.startPoint.value = {x: endPoint[0], y: endPoint[1]}

                            return {
                                ...state,
                                sides
                            }
                        })
                    }
                }
            })
            .on("mouseup", (event) => {
                console.log("mouseUp");
                if(mouseIsDown) {
                    setMouseIsDown(false)
                    setSelectionBoxHidden(true)

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
                        case "Polygon":
                            dispatch(addPiece(generateSidedPiece(
                                lastId+1, 
                                "radius", 
                                dist({x: startPoint[0], y: startPoint[1]}, {x: endPoint[0], y: endPoint[1]}),
                                3,
                                startPoint[0], startPoint[1]
                            )))

                            dispatch(incrementLastPieceId());
                            break;

                        case "Rectangle":
                            let width = Math.abs(endPoint[0] - startPoint[0]);
                            let height = Math.abs(endPoint[1] - startPoint[1]);

                            dispatch(addPiece(generateRectangularPiece(
                                lastId+1,
                                width, height,
                                startPoint[0] + width/2, startPoint[1] + height/2,
                                true
                            )))

                            dispatch(incrementLastPieceId());
                            break;

                        case "Selection": 
                            let x = (startPoint[0] < endPoint[0]) ? startPoint[0] : endPoint[0];
                            let y = (startPoint[1] < endPoint[1]) ? startPoint[1] : endPoint[1];
                                
                            let pieceIds = getPiecesWithinRect(pieces, {
                                x, y,
                                width: Math.abs(endPoint[0] - startPoint[0]),
                                height: Math.abs(endPoint[1] - startPoint[1])
                            })

                            dispatch(setSelectedPiecesId(pieceIds))
                            dispatch(selectPiecesAction(pieceIds))
                            break;
                        case "FreeHandDraw":
                            setLastSideId(lastSideId+1);

                            // update the end side
                            setCurrentPiece(state => {
                                let sides = {...state.sides}
                                let order = [...state.order]
                                sides[lastSideId+1] = generateLineSide(lastSideId+1, {x: endPoint[0], y: endPoint[1]})
                                order.push(lastSideId+1)

                                return {
                                    ...state,
                                    sides,
                                    order
                                }
                            })
                
                            break;
                            
                        default: break;
                    }
                }
            })
        document.addEventListener("keypress", onKeyPress)

        return () => document.removeEventListener("keypress", onKeyPress)
    }, [
        pieces, mouseIsDown, startPoint, 
        endPoint, dispatch, selectedPieceId, 
        newPieceId, svgRef,
        axisAlign, lastId, lastSideId, onKeyPress, tool,
        currentPiece
    ])


    /**
     * renderPieces()
     * @description renders the current pieces
     * @returns returns a rendering of the pieces
     */
    function renderPieces() {
        return Object.values(pieces).map(piece => {
            if(
                piece.constraints.type.value === "sided" ||
                piece.constraints.type.value === "rectangle" || 
                piece.constraints.type.value === "free"
            ) {
                return (
                    <Piece key={piece.id} piece={piece}></Piece>
                )
            } else if(piece.constraints.type.value === "shape2") {
                return (
                    <Piece2 key={piece.id} piece={piece}></Piece2>
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
            case "Rectangle": 
                let width = Math.abs(endPoint[0] - startPoint[0]);
                let height = Math.abs(endPoint[1] - startPoint[1]);
                return <Piece
                    piece={
                        generateRectangularPiece(
                            0,
                            width, height,
                            startPoint[0] + width/2, startPoint[1] + height/2,
                            true
                        )
                    }
                ></Piece>
            case "Polygon": 
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
                        0, 
                        startPoint[0], 
                        startPoint[1],
                        dist(
                            {x: startPoint[0], y: startPoint[1]}, 
                            {x: endPoint[0], y: endPoint[1]}
                        )
                    )
                }> </CirclePiece>
            case "FreeHandDraw": 
                return <OpenPiece
                    piece={currentPiece}
                ></OpenPiece>
            case "Shape2": 
                break;
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



 