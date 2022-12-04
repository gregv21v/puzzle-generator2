
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedPiecesId, setSelectedPiecesId } from "../../selectedPiecesId/selectedPiecesIdSlice";
import { CanvasPanel } from "../../sidesPanel/CanvasPanel";

import { addPiece, removeAllPieces, removePiece } from "../../pieces/piecesSlice";
import { incrementLastPieceId, selectLastPieceId } from "../../lastPieceId/lastPieceIdSlice";
import { forwardRef } from "react";

/**
 * MiddlePanel - the middle panel of the piece builder tab
 */
export const MiddlePanel = forwardRef(({pieces}, canvasRef) => {
    const selectedPieceId = useSelector(selectSelectedPiecesId)[0]
    const dispatch = useDispatch()
    let selectedPiece = pieces[selectedPieceId]
    const lastId = useSelector(selectLastPieceId)



    

    /**
     * copyPiece()
     * @description copies the currently selected piece
     */
    function copyPiece() {
        dispatch(incrementLastPieceId())
        let newPiece = {
            ...selectedPiece,
            id: lastId + 1,
            selected: false
        }
        console.log(newPiece);
        dispatch(addPiece(newPiece))
    }

    /**
     * deletePiece()
     * @description deletes the currently selected piece
     */
    function deletePiece() {
        dispatch(removePiece(selectedPiece.id)) 
        dispatch(setSelectedPiecesId([Object.keys(pieces)[0]]))
    }

    /**
     * deleteAllPieces()
     * @description deletes all the pieces on the canvas
     */
    function deleteAllPieces() {
        dispatch(removeAllPieces())
    }

    return (
        <div>
            <CanvasPanel ref={canvasRef} pieces={pieces}></CanvasPanel>
            
            <button title="loads an svg of pieces from a file" disabled>Load (NYI)</button>
            <button onClick={copyPiece} title="creates a new piece based on the current constraints">Copy</button>
            <button onClick={deleteAllPieces} title="clear all the puzzle pieces from the canvas">Clear</button>
            <button onClick={deletePiece} title="delete the currently selected piece">Delete</button>
            <button title="organzie the pieces into a grid" disabled>Organize (NYI)</button>
            <button title="undo the last action" disabled>Undo (NYI)</button>
            <button title="redo the last action" disabled>Redo (NYI)</button>

        </div>
    )
})