
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedPiecesId, setSelectedPiecesId } from "../../selectedPiecesId/selectedPiecesIdSlice";
import { CanvasPanel } from "../../sidesPanel/CanvasPanel";

import { addPiece, generateFreePiece, removeAllPieces, removePieces } from "../../pieces/piecesSlice";
import { incrementLastPieceId, selectLastPieceId } from "../../lastPieceId/lastPieceIdSlice";
import { forwardRef } from "react";
import { getGlobalCoordinate, getLocalCoordinate, recalculateCenter, rotatePoint } from "../../util/draw";

/**
 * MiddlePanel - the middle panel of the piece builder tab
 */
export const MiddlePanel = forwardRef(({pieces}, canvasRef) => {
    const selectedPieceId = useSelector(selectSelectedPiecesId)[0]
    const selectedPiecesIds = useSelector(selectSelectedPiecesId)
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
        dispatch(removePieces([selectedPiece.id])) 
        dispatch(setSelectedPiecesId([Object.keys(pieces)[0]]))
    }

    /**
     * deleteAllPieces()
     * @description deletes all the pieces on the canvas
     */
    function deleteAllPieces() {
        dispatch(removeAllPieces())
    }

    /**
     * mergePieces()
     * @description merges the pieces together 
     */
    function mergePieces() {
        let newPiece = generateFreePiece(selectedPiecesIds[0])
        let index = 0;
        let centerOfPiece = { x: 0, y: 0 }
        
        for (const id of selectedPiecesIds) {
            for (const sideKey of Object.keys(pieces[id].sides)) {
                let side = pieces[id].sides[sideKey]
                newPiece.order.push(index)
                
                let vertex = side.constraints.startPoint.value;
                let center = pieces[id].constraints.center.value;
                let rotation = (pieces[id].constraints.rotation) ? pieces[id].constraints.rotation.value : 0

                // get the vertex in its global coordinate space
                vertex = getGlobalCoordinate(pieces[id], vertex)

                // rotate the vertex around its center
                vertex = rotatePoint(center, vertex, rotation)

                // convert the global coordinate to the local coordinate space of the new piece
                vertex = getLocalCoordinate(newPiece, vertex);

                let newSide = {
                    ...side,
                    id: index,
                    constraints: {
                        ...side.constraints,
                        startPoint: {
                            ...side.constraints.startPoint,
                            value: vertex
                        }
                    }
                }

                console.log(newSide);

                newPiece.sides[index + ""] = newSide

                index++;
            }
        }

        newPiece = recalculateCenter(newPiece);

        dispatch(removePieces(selectedPiecesIds))
        dispatch(addPiece(newPiece))
    }

    return (
        <div>
            <CanvasPanel ref={canvasRef} pieces={pieces}></CanvasPanel>
            
            <button title="loads an svg of pieces from a file" disabled>Load (NYI)</button>
            <button onClick={copyPiece} title="creates a new piece based on the current constraints">Copy</button>
            <button onClick={deleteAllPieces} title="clear all the puzzle pieces from the canvas">Clear</button>
            <button onClick={deletePiece} title="delete the currently selected piece">Delete</button>
            <button onClick={mergePieces} title="Merges the currently selected peices together">Merge</button>
            <button title="organzie the pieces into a grid" disabled>Organize (NYI)</button>
            <button title="undo the last action" disabled>Undo (NYI)</button>
            <button title="redo the last action" disabled>Redo (NYI)</button>

        </div>
    )
})