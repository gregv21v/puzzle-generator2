
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedPieceId } from "../../selectedPieceId/selectedPieceIdSlice";
import { setSelectedPieceId } from "../../selectedPieceId/selectedPieceIdSlice";
import { CanvasPanel } from "../../sidesPanel/CanvasPanel";
import { downloadSvg } from "svg-crowbar"
import { addPiece, removeAllPieces, removePiece } from "../../pieces/piecesSlice";
import { selectTool } from "../../tool/toolSlice";
import { incrementLastPieceId, selectLastPieceId } from "../../lastPieceId/lastPieceIdSlice";

/**
 * MiddlePanel - the middle panel of the piece builder tab
 */
export function MiddlePanel({pieces}) {
    const canvasRef = useRef(null)
    const selectedPieceId = useSelector(selectSelectedPieceId)
    const selectedTool = useSelector(selectTool)
    const [exportClicked, setExportClicked] = useState(false)
    const dispatch = useDispatch()
    let selectedPiece = pieces[selectedPieceId]
    const lastId = useSelector(selectLastPieceId)


    useEffect(() => {
        if(exportClicked) {
            downloadSvg(canvasRef.current.cloneNode(true), "test.svg");
            setExportClicked(false);
        }
    }, [exportClicked])

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
        dispatch(setSelectedPieceId(Object.keys(pieces)[0]))
    }

    /**
     * deleteAllPieces()
     * @description deletes all the pieces on the canvas
     */
    function deleteAllPieces() {
        dispatch(removeAllPieces())
    }

    /**
     * exportAsSVG()
     * @description exports the current canvas as an svg
     */
    function exportAsSVG() {
        setExportClicked(true);
    }

    return (
        <div>
            <CanvasPanel ref={canvasRef} pieces={pieces}></CanvasPanel>
            <button onClick={copyPiece} title="creates a new piece based on the current constraints">Copy</button>
            <button onClick={exportAsSVG} title="exports the puzzle pieces to an svg file">Export as SVG</button>
            <button title="loads an svg of pieces from a file" disabled>Load (NYI)</button>
            <button onClick={deleteAllPieces} title="clear all the puzzle pieces from the canvas">Clear</button>
            <button onClick={deletePiece} title="delete the currently selected piece">Delete</button>
            <button title="organzie the pieces into a grid" disabled>Organize (NYI)</button>
            <button title="undo the last action" disabled>Undo (NYI)</button>
            <button title="redo the last action" disabled>Redo (NYI)</button>
        </div>
    )
}