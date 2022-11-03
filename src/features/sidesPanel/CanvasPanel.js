import { useEffect, useRef, useState, forwardRef } from "react";
import { Piece } from "../piece/Piece";
import * as d3 from "d3"
import { SelectionBox } from "../selectionBox/SelectionBox";
import { CirclePiece } from "../piece/CirclePiece";
import { dist, getPiecesWithinRect } from "../util/util";
import { addPiece, deselectAllPieces, selectPiecesAction, setSideStart, setSideEnd, addSide } from "../pieces/piecesSlice";
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

            console.log("Close Free Form Piece");
            // close the shape
            let piece = pieces[newPieceId]
            let side = piece.sides[0];

            console.log(side);

            dispatch(addSide({
                pieceId: newPieceId,
                side: {
                    start: {x: endPoint[0], y: endPoint[1]},
                    end: {x: side.start.x, y: side.start.y},
                    constraints: {
                        subdivisions: 3, tabLength: 10, startIn: false
                    }
                }
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

                if(newPieceId === -1 && tool === "FreeHandDraw") {
                    dispatch(addPiece({
                        id: lastId + 1,
                        type: "free",
                        test: "dfadsf",
                        selected: true,
                        constraints: {
                            tabLength: 10,
                            tabWidth: 10,
                            subdivisions: 3
                        },
                        sides: [
                            {
                                id: 0,
                                start: {x: startPoint[0], y: startPoint[1]},
                                end: {x: endPoint[0], y: startPoint[1]},
                                constraints: {
                                    subdivisions: 3, tabLength: 10, startIn: false
                                }
                            }
                        ]
                    }))

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
                            dispatch(addPiece({
                                    id: lastId+1,
                                    type: "circle",
                                    x: startPoint[0],
                                    y: startPoint[1],
                                    color: "blue",
                                    constraints: {
                                        radius: dist({x: startPoint[0], y: startPoint[1]}, {x: endPoint[0], y: endPoint[1]})
                                    }
                            }))

                            dispatch(incrementLastPieceId());
                            break;
                        case "Shape":
                            dispatch(addPiece({
                                id: lastId+1,
                                type: "sided",
                                x: startPoint[0],
                                y: startPoint[1],
                                color: "blue",
                                constraints: {
                                    rotation: 0,
                                    sideLength: 0,
                                    radius: dist({x: startPoint[0], y: startPoint[1]}, {x: endPoint[0], y: endPoint[1]})
                                },
                                sides: [
                                    {
                                      id: 0, 
                                      constraints: {
                                        subdivisions: 3, tabLength: 10, startIn: false
                                      }
                                    },
                                    {
                                      id: 1, 
                                      constraints: {
                                        subdivisions: 3, tabLength: 10, startIn: false
                                      }
                                    },
                                    {
                                      id: 2, 
                                      constraints: {
                                        subdivisions: 3, tabLength: 10, startIn: false
                                      }
                                    }
                                ]
                            }))

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
                                end: {x: endPoint[0], y: endPoint[1]}
                            }))

                            dispatch(setSideStart({
                                pieceId: newPieceId,
                                sideId: selectedSideId,
                                start: {x: startPoint[0], y: startPoint[1]}
                            }))

                            dispatch(addSide({
                                pieceId: newPieceId,
                                side: {
                                    start: {x: startPoint[0], y: startPoint[1]},
                                    end: {x: endPoint[0], y: endPoint[1]},
                                    constraints: {
                                        subdivisions: 3, tabLength: 10, startIn: false
                                    }
                                }
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

    return (<div>
        <svg ref={svgRef} width="600" height="600" style={{
            border: "solid black 2px"
        }}>
            {
                Object.values(pieces).map(piece => {

                    if(piece.type === "sided") {
                        return (
                            <Piece key={piece.id} piece={piece}></Piece>
                        )
                    } else if(piece.type === "circle") {
                        return (
                            <CirclePiece key={piece.id} piece={piece}></CirclePiece>
                        )
                    } else if(piece.type === "free") {
                        return (
                            <FreeFormPiece key={piece.id} piece={piece}></FreeFormPiece>
                        )
                    }
                })
            }
        {
            (() => {
                switch(tool) {
                    case "Shape": 
                        return <Piece
                            piece={{
                                id: 0,
                                type: "sided",
                                x: startPoint[0],
                                y: startPoint[1],
                                color: "blue", 
                                useSideLength: false,
                                constraints: {
                                    rotation: 0,
                                    sideLength: 40,
                                    radius: dist({x: startPoint[0], y: startPoint[1]}, {x: endPoint[0], y: endPoint[1]})
                                },
                                sides: [
                                    {
                                      id: 0, 
                                      constraints: {
                                        subdivisions: 3, tabLength: 10, startIn: false
                                      }
                                    },
                                    {
                                      id: 1, 
                                      constraints: {
                                        subdivisions: 3, tabLength: 10, startIn: false
                                      }
                                    },
                                    {
                                      id: 2, 
                                      constraints: {
                                        subdivisions: 3, tabLength: 10, startIn: false
                                      }
                                    }
                                ]
                            }}
                        ></Piece>
                    case "Circle":
                        console.log("Circle tool selected");
                        
                        console.log(dist(startPoint, endPoint));
                        return <CirclePiece piece={{
                            id: lastId+1,
                            type: "circle",
                            x: startPoint[0],
                            y: startPoint[1],
                            color: "blue",
                            constraints: {
                                radius: dist({x: startPoint[0], y: startPoint[1]}, {x: endPoint[0], y: endPoint[1]})
                            }
                        }}> </CirclePiece>
                    case "Selection": 
                        return <SelectionBox startPoint={startPoint} endPoint={endPoint} hidden={selectionBoxHidden}/>
                    case "FreeHandDraw": 
                        console.log("Tool selected");
                        return <FreeFormPiece piece={{
                            id: lastId+1,
                            type: "free",
                            selected: true,
                            constraints: {
                                tabLength: 10,
                                tabWidth: 10,
                                subdivisions: 3
                            },
                            sides: [
                                {
                                    start: {x: startPoint[0], y: startPoint[1]},
                                    end: {x: endPoint[0], y: endPoint[1]},
                                    constraints: {
                                        subdivisions: 3, tabLength: 10, startIn: false
                                    }
                                }
                            ]
                        }}
                        ></FreeFormPiece>
                    default: 
                        return "Nothing"
                }
            })()
        }
        </svg>
    </div>)    
})



 