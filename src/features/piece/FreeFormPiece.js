import * as d3 from "d3"
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { deselectAllPieces, moveFreePiece, movePiece, selectPiecesAction } from '../pieces/piecesSlice';
import { setSelectedPieceId } from "../selectedPieceId/selectedPieceIdSlice";
import { createPathForLineSide } from "../util/util";



/**
 * Piece
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
                console.log(event);
                //dispatch(deselectAllPieces())
                    //dispatch(selectPiece([piece.id]))
                if(piece.selected) 
                    dispatch(moveFreePiece({
                        pieceId: piece.id,
                        dx: event.dx,
                        dy: event.dy
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

        if(piece.sides.length > 0)
            path.moveTo(piece.sides[0].constraints.start.x, piece.sides[0].constraints.start.y)

        for (let index = 0; index < piece.sides.length; index++) {
            let side = piece.sides[index];
            createPathForLineSide(path, side.constraints);
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




    return (
        <path 
            ref={pathRef} d={createPiecePath().toString()}
            onClick={onClick}
            fill="red"  stroke={(piece.selected) ? "green" : "blue"}    strokeWidth="2" />
    )
}