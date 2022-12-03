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


    /**
     * closeFreeFormPiece()
     * @description closes the path of the current free form piece
     * 
     */
    function closeFreeFormPiece() {
        if(newPieceId !== -1) {
            setNewPieceId(-1);
        }
    }


    /**
     * addNewSide()
     * @description adds a new side to a free draw piece
     * @param pieceId the id of the piece to add the side to 
     */
    function addNewSide() {
        dispatch(addSide({
            pieceId: newPieceId,
            side: generateLineSide(
                lastSideId+1, 
                {x: endPoint[0], y: endPoint[1]}
            )
        }))

        setLastSideId(lastSideId+1)
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

                // Create a new free form piece with its first side
                if(newPieceId === -1 && tool === "FreeHandDraw") {

                    setLastSideId(lastSideId+1)

                    dispatch(addPiece(
                        generateFreePiece(lastId+1, {x: startPoint[0], y: startPoint[1]}, true)
                    ))

                    setNewPieceId(lastId + 1)

                    dispatch(incrementLastPieceId());
                } 
                
            })
            .on("mousemove", (event) => {
                //console.log("mousemove")
                if(mouseIsDown) {
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
                            addNewSide();
                
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
            if(
                piece.constraints.type.value === "sided" ||
                piece.constraints.type.value === "rectangle" || 
                piece.constraints.type.value === "free"
            ) {
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
            case "Free": 
                return <Piece
                    piece={
                        generateFreePiece(
                            lastId+1, {x: startPoint[0], y: startPoint[1]}, true
                        )
                    }
                ></Piece>
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



 