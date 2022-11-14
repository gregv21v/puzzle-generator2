/**
 * ConstraintsPanel - a panel to modify the constraints of the selected piece
 */

import { useDispatch } from "react-redux"
import { ConstraintsTable } from "../constraints/ConstraintsTable"
import { setConstraintValue, toggleConstraintComputed } from "../pieces/piecesSlice"
import { updatePiece, updatePiecePosition } from "../util/pieceFunctions"

export function ConstraintsPanel({piece}) {
    const dispatch = useDispatch()

    /**
     * updateConstraints()
     * @description updates the constraints of a piece
     * @param {string} constraintName the constraintName of the constraint
     * @param {object} newValue the object with the constraints
     * @param {piece} piece the piece
     */
    function updateConstraints(constraintName, newValue, piece) {         
        if(constraintName === "radius" || constraintName === "sideLength")
            updatePiece(dispatch, piece, constraintName, newValue);
        else if(constraintName === "position") {
            updatePiecePosition(dispatch, piece, newValue);
        } else if(constraintName === "rotation") {
            dispatch(setConstraintValue({
                path: [piece.id, "rotation"],
                newValue: newValue
            }))
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
        <div>
            <table style={{fontSize: 10}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th colSpan={2}>Value</th>
                        <th>Computed</th>
                    </tr>
                </thead>
                <ConstraintsTable
                        root={[piece.id]}
                        constraints={piece.constraints}
                        updateConstraints={(path, newValue) => 
                            updateConstraints(
                                path[path.length-1], newValue, piece
                            )
                        }
                        updateComputed={updateComputed}
                >
                </ConstraintsTable>
            </table>
        </div>
    )
}