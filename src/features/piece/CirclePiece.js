import * as d3 from "d3"
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { deselectAllPieces, movePiece, selectPiecesAction } from '../pieces/piecesSlice';
import { setSelectedPieceId } from "../selectedPieceId/selectedPieceIdSlice";


/**
 * CirclePiece 
 * @param {Piece} piece the pieces properties
 */
export function CirclePiece({piece}) {
    const pathRef = useRef()
    const dispatch = useDispatch()

    /**
     * Implements the ability to drag pieces around the canvas
     */
    useEffect(() => {    
        const handleDrag = d3.drag()
            .on('drag', function(event) {
                //dispatch(deselectAllPieces())
                //dispatch(selectPiece([piece.id]))
                dispatch(movePiece({
                    pieceId: piece.id,
                    x: event.x,
                    y: event.y
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

        path.moveTo(piece.x, piece.y)
        path.arc(piece.x, piece.y, piece.constraints.radius, 0, Math.PI * 2)
        path.closePath()

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
        dispatch(setSelectedPieceId(piece.id))
    }


    console.log(piece);

    return (
        <path 
            ref={pathRef} d={createPiecePath().toString()}
            onClick={onClick}
            fill="red" stroke={(piece.selected) ? "green" : "blue"} strokeWidth="2" />
    )
}