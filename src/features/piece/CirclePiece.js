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
                if(piece.selected)     
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

        path.moveTo(
            piece.x + (piece.constraints.radius) * Math.cos(0),
            piece.y + (piece.constraints.radius) * Math.sin(0)
        )
        let segments = 20
        let angle = (Math.PI * 2) / segments
        let tabLength = 20;
        let offset = 0;
        
        for(let i = 0; i < segments; i++) {
            
            path.arc(piece.x, piece.y, piece.constraints.radius, angle * (i+offset), angle * (i+offset+1))
            path.lineTo(
                piece.x + (piece.constraints.radius + tabLength) * Math.cos(angle * (i+offset+1)),
                piece.y + (piece.constraints.radius + tabLength) * Math.sin(angle * (i+offset+1))
            )
            path.arc(piece.x, piece.y, piece.constraints.radius + tabLength, angle * (i+offset+1), angle * (i+offset+2))
            path.lineTo(
                piece.x + (piece.constraints.radius) * Math.cos(angle * (i+offset+2)),
                piece.y + (piece.constraints.radius) * Math.sin(angle * (i+offset+2))
            )

            offset += 1;
        }
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