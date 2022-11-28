
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedPieceId } from "../../selectedPieceId/selectedPieceIdSlice";
import { setSelectedPieceId } from "../../selectedPieceId/selectedPieceIdSlice";
import { CanvasPanel } from "../../sidesPanel/CanvasPanel";
import { downloadSvg } from "svg-crowbar"
import { addPiece, loadPieces, removeAllPieces, removePiece } from "../../pieces/piecesSlice";
import { selectTool } from "../../tool/toolSlice";
import { incrementLastPieceId, selectLastPieceId } from "../../lastPieceId/lastPieceIdSlice";
import { saveToFile } from "../../util/util";
import { Modal } from "../../modal/Modal";

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
    const [importDialogShown, setImportDialogShown] = useState(false);
    const [file, setFile] = useState(null);
    const inputFile = useRef(null);



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

    /**
     * exportAsJSON()
     * @description exports the puzzle as json
     */
    function exportAsJSON() {
        console.log("Exported as JSON");
        saveToFile("puzzle.json", pieces);
    }


    /**
     * importFromJSON()
     * @description imports a puzzle from a json file
     */
    function importFromJSON() {
        setImportDialogShown(true);
    }

    /**
     * uploadJSON()
     * @description uploads the json into the program
     */
    function uploadJSON() {
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
            dispatch(loadPieces(JSON.parse(event.target.result)))
        })

        reader.readAsText(file)
    }

    return (
        <div>
            <CanvasPanel ref={canvasRef} pieces={pieces}></CanvasPanel>

            <Modal show={importDialogShown} handleClose={() => setImportDialogShown(false)}>
                <h1>Select File to Import</h1>
                <input 
                    type="file" 
                    id="file" 
                    ref={inputFile} 
                    accept=".json" 
                    onChange={event => setFile(event.target.files[0])}
                ></input>
                <button onClick={uploadJSON}>Upload JSON</button>
            </Modal>
            
            <button onClick={exportAsSVG} title="exports the puzzle pieces to an svg file">Export as SVG</button>
            <button onClick={exportAsJSON} title="exports the puzzle as a json file">Export as JSON</button>
            <button onClick={importFromJSON} title="imports a puzzle from json">Import from JSON</button>
            <button title="loads an svg of pieces from a file" disabled>Load (NYI)</button>
            <button onClick={copyPiece} title="creates a new piece based on the current constraints">Copy</button>
            <button onClick={deleteAllPieces} title="clear all the puzzle pieces from the canvas">Clear</button>
            <button onClick={deletePiece} title="delete the currently selected piece">Delete</button>
            <button title="organzie the pieces into a grid" disabled>Organize (NYI)</button>
            <button title="undo the last action" disabled>Undo (NYI)</button>
            <button title="redo the last action" disabled>Redo (NYI)</button>

        </div>
    )
}