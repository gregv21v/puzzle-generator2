import * as d3 from "d3"
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAxisLock } from "../axisLock/axisLockSlice";
import { movePiece, selectPieceAction } from '../pieces/piecesSlice';
import { setSelectedPiecesId } from "../selectedPiecesId/selectedPiecesIdSlice";
import { selectTool } from "../tool/toolSlice";
import { createPathForLineEdge, getGlobalCoordinate } from "../util/draw";
import { Vertex } from "./Vertex";
import { Vertex2 } from "./Vertex2";



/**
 * Piece
 * @description Creates the piece component.
 * @param {Props} props the props of the component
 * @param {Piece} piece the piece that this component will render
 * @param {string} mode the type of mode that this component is in. You can either render vertices or edges
 * @returns an object the describes the rendering of the component
 */
export function Piece2({piece, mode}) {
    const pathRef = useRef()
    const dispatch = useDispatch()
    const tool = useSelector(selectTool)
    const axisLock = useSelector(selectAxisLock)

    /**
     * Implements the ability to drag pieces around the canvas
     */
    useEffect(() => {    
        const handleDrag = d3.drag()
            .on('drag', function(event) {
                if(piece.selected) {
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
     * createPieceEdge() 
     * @description creates the side of the piece
     */
    function createPieceEdge(path, piece, edge) {
        switch(edge.constraints.type.value) {
            case "line": 
                createPathForLineEdge(path, piece, edge);
                break;
            case "arc":
                //createPathForArcSide(path, piece, current.constraints, {x: current.x, y: current.y})
                break;
            case "arcTo":
                //createPathForArcToSide(path, side.constraints, startPoint, endPoint)
                break;
            default:
                break;
        }
    }

    /**
     * createPiecePath() 
     * @description creates the path for the piece
     * @returns the path of the piece
     */
    function createPiecePath() {
        let path = d3.path();
        let first = true;
    
        for (let edge of piece.edges) {
            // first side 
            if(first) {
                let point = (piece.vertices[edge.constraints.start.value]) ? piece.vertices[edge.constraints.start.value] : {x: 0, y: 0}
                let start = getGlobalCoordinate(piece, point)
                path.moveTo(start.x, start.y);   
                first = false;    
            }

            createPieceEdge(path, piece, edge);
        }

        path.closePath()

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
                piece.vertices.map((vertex, index) => {
                   return <Vertex2 key={index} index={index} piece={piece} vertex={vertex}></Vertex2>
                })
            }
        </g>
    }


    /**
     * renderCenter()
     * @description renders the center point for the piece
     */
    function renderCenter() {
        return <rect
            key={"center"}
            width={10}
            height={10}
            x={piece.constraints.center.value.x - 5}
            y={piece.constraints.center.value.y - 5}
            fill="white"
            stroke="red"
        >
        </rect>
    }

    

    /**
     * onClick()
     * @description selects the piece on click
     */
    function onClick() {
        console.log(typeof piece.id);
        dispatch(selectPieceAction(piece.id))
        dispatch(setSelectedPiecesId([piece.id]))
    }

    // renders the piece
    return (
        <g key={piece.id}>
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
            {(piece.selected && tool === "Edit") ? renderCenter() : ""}
        </g>
            
    )
}