/**
 * ConstraintsPanel - a panel to modify the constraints of the selected piece
 */

import { useDispatch } from "react-redux"
import { ConstraintsTable } from "../constraints/ConstraintsTable"
import { Panel } from "../panel/Panel"
import { setConstraintValue, toggleConstraintComputed } from "../pieces/piecesSlice"
import { getRectangle } from "../util/geometry"
import { updatePiece, updatePiecePosition, updatePieceWithPolygon } from "../util/pieceFunctions"

export function ConstraintsPanel({piece}) {
    const dispatch = useDispatch()

    /**
     * updateConstraints()
     * @description updates the constraints of a piece
     * @param {string} constraintName the constraintName of the constraint
     * @param {object} newValue the new value of the constraint
     * @param {object} oldValue the old value of the constraint
     * @param {piece} piece the piece
     */
    function updateConstraints(constraintName, newValue, oldValue, piece) {      
        console.log(constraintName);
        console.log("Old Value: " + oldValue);
        console.log("New Value: " + newValue);
        
        if(constraintName === "radius" || constraintName === "sideLength") {
            updatePiece(dispatch, piece, constraintName, newValue);
        } else if(constraintName === "position") {
            updatePiecePosition(dispatch, piece, newValue);
        } else if(constraintName === "rotation") {
            dispatch(setConstraintValue({
                path: [piece.id, "rotation"],
                newValue: newValue
            }))
        } else if(constraintName === "type") {
            // convert the piece to that of the new type

        } else if(
            piece.constraints.type.value === "rectangle" && 
            constraintName === "width"
        ) {
            let rect = getRectangle(piece.center, newValue, piece.constraints.height.value);
            updatePieceWithPolygon(dispatch, piece, rect);
            console.log("Updating Width");
        } else if(
            piece.constraints.type.value === "rectangle" && 
            constraintName === "height"
        ) {
            let rect = getRectangle(piece.center, piece.constraints.width.value, newValue);
            updatePieceWithPolygon(dispatch, piece, rect);
        } else if(constraintName === "tabLength") {
            // update the sides of the shape with the new tab length
            for (const key of Object.keys(piece.sides)) {
                dispatch(setConstraintValue({
                    path: [piece.id, "sides", key, "tabLength"],
                    newValue: newValue
                }))
            }
        }
            
    }

    /**
     * updateConstraints()
     * @description updates the constraints of a piece
     * @param {string} constraintName the constraintName of the constraint
     * @param {object} object the object with the constraints
     * @param {piece} piece the piece
     */
    function updateComputed(path) {
        let constraintName = path[path.length-1]
        if(constraintName === "sideLength") {
            // make radius computed
            if(piece.constraints.radius.computed) {
                // toggle the piece constraint computed value
                dispatch(toggleConstraintComputed({
                    path: [piece.id, "radius"]
                }))
            } 
            // How do you compute the radius from the side length?
        } else if(constraintName === "radius") {
            // make side length computed
            // make sideLength computed
            if(piece.constraints.sideLength.computed) {
                // toggle the piece constraint computed value
                dispatch(toggleConstraintComputed({
                    path: [piece.id, "sideLength"]
                }))
            } 
        } 
    }

    return (
        <Panel title={"Piece Constraints"}>
            <ConstraintsTable
                    root={[piece.id]}
                    constraints={piece.constraints}
                    updateConstraints={(path, newValue, oldValue) => 
                        updateConstraints(
                            path[path.length-1], newValue, oldValue, piece
                        )
                    }
                    updateComputed={updateComputed}
            >
            </ConstraintsTable>
        </Panel>
    )
}