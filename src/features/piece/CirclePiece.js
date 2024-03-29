import * as d3 from "d3"
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { movePiece, selectPieceAction } from '../pieces/piecesSlice';
import { setSelectedPiecesId } from "../selectedPiecesId/selectedPiecesIdSlice";


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
    }, [piece, dispatch])

    /**
     * createPiecePath() 
     * @description creates the path for the piece
     * @returns the path of the piece
     */
    function createPiecePath() {
        let path = d3.path();

        path.moveTo(
            piece.constraints.center.value.x + (piece.constraints.radius.value) * Math.cos(0),
            piece.constraints.center.value.y + (piece.constraints.radius.value) * Math.sin(0)
        )
        let angle = (Math.PI * 2) / piece.constraints.subdivisions.value
        let offset = 0;
        
        for(let i = 0; i < piece.constraints.subdivisions.value; i++) {
            
            path.arc(piece.constraints.center.value.x, piece.constraints.center.value.y, piece.constraints.radius.value, angle * (i+offset), angle * (i+offset+1))
            path.lineTo(
                piece.constraints.center.value.x + (piece.constraints.radius.value + piece.constraints.tabLength.value) * Math.cos(angle * (i+offset+1)),
                piece.constraints.center.value.y + (piece.constraints.radius.value + piece.constraints.tabLength.value) * Math.sin(angle * (i+offset+1))
            )
            path.arc(piece.constraints.center.value.x, piece.constraints.center.value.y, piece.constraints.radius.value + piece.constraints.tabLength.value, angle * (i+offset+1), angle * (i+offset+2))
            path.lineTo(
                piece.constraints.center.value.x + (piece.constraints.radius.value) * Math.cos(angle * (i+offset+2)),
                piece.constraints.center.value.y + (piece.constraints.radius.value) * Math.sin(angle * (i+offset+2))
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
        dispatch(selectPieceAction(piece.id))
        dispatch(setSelectedPiecesId([piece.id]))
    }

    
    return (
        <path 
            ref={pathRef} d={createPiecePath().toString()}
            onClick={onClick}
            fill={piece.constraints.fill.value} 
            stroke={(piece.selected) ? "green" : piece.constraints.stroke.value} 
            strokeWidth={(piece.selected) ? "4" : "2"} />
    )
}