

import { useDispatch, useSelector } from "react-redux";
import { selectSelectedPieceId, setSelectedPieceId } from "../../selectedPieceId/selectedPieceIdSlice";
import { CanvasPanel } from "../../sidesPanel/CanvasPanel";

import { addPiece, removeAllPieces, removePiece } from "../../pieces/piecesSlice";

/**
 * MiddlePanel - the middle panel of the piece builder tab
 */
export function MiddlePanel({pieces}) {
    const selectedPieceId = useSelector(selectSelectedPieceId);
    const dispatch = useDispatch()
    let selectedPiece = pieces[selectedPieceId]

    /**
     * copyPiece()
     * @description copies the currently selected piece
     */
    function copyPiece() {
        dispatch(
            addPiece(selectedPiece)
        )
    }

    /**
     * deletePiece()
     * @description deletes the currently selected piece
     */
    function deletePiece() {
        dispatch(removePiece(selectedPiece.id)) 
        //dispatch(setSelectedPieceId(0))
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
            <CanvasPanel pieces={pieces}></CanvasPanel>
            <button onClick={copyPiece} title="creates a new piece based on the current constraints">Copy</button>
            <button title="exports the puzzle pieces to an svg file">Export as SVG</button>
            <button title="loads an svg of pieces from a file" disabled>Load (NYI)</button>
            <button onClick={deleteAllPieces} title="clear all the puzzle pieces from the canvas">Clear</button>
            <button onClick={deletePiece} title="delete the currently selected piece">Delete</button>
            <button title="organzie the pieces into a grid" disabled>Organize (NYI)</button>
            <button title="undo the last action" disabled>Undo (NYI)</button>
            <button title="redo the last action" disabled>Redo (NYI)</button>
        </div>
    )
}