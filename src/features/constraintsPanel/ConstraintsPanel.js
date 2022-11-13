/**
 * ConstraintsPanel - a panel to modify the constraints of the selected piece
 */

import { useDispatch } from "react-redux"
import { ConstraintsTable } from "../constraints/ConstraintsTable"
import { togglePieceConstraintComputed } from "../pieces/piecesSlice"
import { updatePiece, updatePiecePosition } from "../util/pieceFunctions"

export function ConstraintsPanel({piece}) {
    const dispatch = useDispatch()

    /**
     * updateConstraints()
     * @description updates the constraints of a piece
     * @param {string} constraintName the constraintName of the constraint
     * @param {object} object the object with the constraints
     * @param {piece} piece the piece
     */
    function updateConstraints(newValue, constraintName, piece) {         
        /*if(constraintName !== "position")
            updatePiece(dispatch, piece, constraintName, newValue);
        else {
            updatePiecePosition(dispatch, piece, newValue);
        }*/
    }

    /**
     * updateConstraints()
     * @description updates the constraints of a piece
     * @param {string} constraintName the constraintName of the constraint
     * @param {object} object the object with the constraints
     * @param {piece} piece the piece
     */
    function updateComputed(constraintName, piece) {
        /*if(constraintName === "sideLength") {
            // make radius computed
            if(piece.constraints.radius.computed) {
                // toggle the piece constraint computed value
                dispatch(togglePieceConstraintComputed({
                    pieceId: piece.id,
                    constraintId: "radius"
                }))
            } 
            // How do you compute the radius from the side length?
        } else if(constraintName === "radius") {
            // make side length computed
            // make sideLength computed
            if(piece.constraints.sideLength.computed) {
                // toggle the piece constraint computed value
                dispatch(togglePieceConstraintComputed({
                    pieceId: piece.id,
                    constraintId: "sideLength"
                }))
            } 
        }*/
    }

    console.log("ConstraintsPanel");
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
                        updateConstraints={updateConstraints}
                        updateComputed={updateComputed}
                >
                </ConstraintsTable>
            </table>
        </div>
    )
}