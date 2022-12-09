import * as d3 from "d3"
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { movePiece, selectPieceAction } from '../pieces/piecesSlice';
import { setSelectedPiecesId } from "../selectedPiecesId/selectedPiecesIdSlice";
import { selectTool } from "../tool/toolSlice";
import { createPathForArcSide, createPathForLineSide, getGlobalCoordinate } from "../util/draw";
import { Vertex } from "./Vertex";



/**
 * Piece
 * @description Creates the piece component.
 * @param {Props} props the props of the component
 * @param {Piece} piece the piece that this component will render
 * @param {string} mode the type of mode that this component is in. You can either render vertices or edges
 * @returns an object the describes the rendering of the component
 */
export function Piece({piece}) {
    const pathRef = useRef()
    const dispatch = useDispatch()
    const tool = useSelector(selectTool)
    const mode = "vertices";

    /**
     * Implements the ability to drag pieces around the canvas
     */
    useEffect(() => {    
        const handleDrag = d3.drag()
            .on('drag', function(event) {
                if(piece.selected && tool === "Selection") {
                    dispatch(movePiece({
                        pieceId: piece.id,
                        x: event.x,
                        y: event.y
                    }))
                }
            });
        handleDrag(d3.select(pathRef.current));
    }, [piece, dispatch])


    /** 
     * createPieceSide() 
     * @description creates the side of the piece
     */
    function createPieceSide(path, piece, current, next) {
        if(current && next) {
            switch(current.constraints.type.value) {
                case "line": 
                    createPathForLineSide(path, piece, current.constraints, next.constraints.startPoint.value);
                    break;
                case "arc":
                    createPathForArcSide(path, piece, current.constraints, {x: current.x, y: current.y})
                    break;
                case "arcTo":
                    //createPathForArcToSide(path, side.constraints, startPoint, endPoint)
                    break;
                default:
                    break;
            }
        }
        
    }

    /**
     * createPiecePath() 
     * @description creates the path for the piece
     * @returns the path of the piece
     */
    function createPiecePath() {
        let path = d3.path();

        if(Object.keys(piece.sides).length >= 3) {
            let current = null,
                next = null,
                first = null,
                i = 0;

            
            
            for (let side of Object.values(piece.sides)) {
                // first side 
                if(i === 0) {
                    let start = getGlobalCoordinate(piece, side.constraints.startPoint.value)
                    path.moveTo(start.x, start.y);
                    next = side;
                    first = side;
                // in the middle
                } else if(i > 0) {
                    current = next;
                    next = side;
                } 

                createPieceSide(path, piece, current, next);
                i++;
            }

            // current equals the first one 
            current = next;
            next = first;

            createPieceSide(path, piece, current, next);

            path.closePath()
        }


        return path;  
    }

    /**
     * renderVertices()
     * @description renders the vertices of the shape
     * @returns returns a rendering of the vertices of the shape
     */
    function renderVertices() {
        return <g
            transform={"rotate(" + 
                piece.constraints.rotation.value + ", " + 
                piece.constraints.center.value.x + ", " + 
                piece.constraints.center.value.y + ")"
            }
        >
            {
                Object.values(piece.sides).map(side => {
                   return <Vertex piece={piece} vertex={side}></Vertex>
                })}
        </g>
    }

    /**
     * onClick()
     * @description selects the piece on click
     */
    function onClick() {
        console.log(piece.id);
        dispatch(selectPieceAction(piece.id))
        dispatch(setSelectedPiecesId([piece.id]))
    }

    // renders the piece
    //{(mode === "edges") ? renderEdges() : ""}
    return (
        <g>
            <path 
                ref={pathRef} d={createPiecePath().toString()}
                onClick={onClick}
                transform={"rotate(" + 
                    piece.constraints.rotation.value + ", " + 
                    piece.constraints.center.value.x + ", " + 
                    piece.constraints.center.value.y + ")"
                }
                fill={piece.constraints.fill.value} 
                stroke={(piece.selected && tool !== "Edit") ? "green" : piece.constraints.stroke.value} 
                strokeWidth={(piece.selected) ? "4" : "2"} />
            {(piece.selected && tool === "Edit") ? renderVertices() : ""}
            
        </g>
            
    )
}