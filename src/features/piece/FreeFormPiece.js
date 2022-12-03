import * as d3 from "d3"
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { deselectAllPieces, movePiece, selectPiecesAction } from '../pieces/piecesSlice';
import { setSelectedPiecesId } from "../selectedPieceId/selectedPiecesIdSlice";
import { createPathForLineSide } from "../util/draw";



/**
 * Piece
 * @depricated
 * @description Creates the piece component.
 * @param {Props} props the props of the component
 * @returns an object the describes the rendering of the component
 */
export function FreeFormPiece({piece}) {
    const pathRef = useRef()
    const dispatch = useDispatch()

    /**
     * Implements the ability to drag pieces around the canvas
     */
    useEffect(() => {  
          
        const handleDrag = d3.drag()
            .on('drag', function(event) {
                if(piece.selected) 
                    dispatch(movePiece({
                        pieceId: piece.id,
                        x: event.dx,
                        y: event.dy
                    }))
            });
        handleDrag(d3.select(pathRef.current));
    }, [piece])

    /**
     * createPiecePath() 
     * @description creates the path for the piece
     * @returns the path of the piece
     */
    function createPiecePath() {
        let path = d3.path();

        if(Object.keys(piece.sides).length >= 3) {
            let first = true;
            for (let side of Object.values(piece.sides)) {

                if(first) {
                    path.moveTo(side.constraints.startPoint.value.x, side.constraints.startPoint.value.y);
                    first = false;
                }

                switch(side.constraints.type.value) {
                    case "line": 
                        createPathForLineSide(path, side.constraints);
                        break;
                    case "arc":
                        //createPathForArcSide(path, side.constraints, {x: side.x, y: side.y})
                        break;
                    case "arcTo":
                        //createPathForArcToSide(path, side.constraints, startPoint, endPoint)
                        break;
                    default:
                        break;
                }
            }

            path.closePath()
        }

        return path;  
    }

    /**
     * onClick()
     * @description selects the piece on click
     */
    function onClick() {
        console.log("Piece Clicked");
        dispatch(deselectAllPieces())
        dispatch(selectPiecesAction([piece.id]))
        dispatch(setSelectedPiecesId([piece.id]))
    }




    return (
        <path 
            ref={pathRef} d={createPiecePath().toString()}
            onClick={onClick}
            fill="red"  stroke={(piece.selected) ? "green" : "blue"}    strokeWidth="2" />
    )
}