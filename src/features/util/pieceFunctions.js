import { setPieceConstraintValue, setSideConstraintsValue } from "../pieces/piecesSlice";
import { getPolygon } from "./geometry";

/**
 * updatePiece() 
 * @description updates the sides of a piece
 * @param {func} dispatch the dispatch function
 * @param {piece} piece the piece to update
 * @param {string} constraintName the name of the constraint to update the sides with
 * @param {string} value the value of the constraint to update the sides with
 */
export function updatePiece(dispatch, piece, constraintName, value) {
    // get the new polygon
    let polygon = getPolygon(piece.constraints.position.value, piece.sides.length, constraintName, value);

    updatePieceWithPolygon(dispatch, piece, polygon);
}

/**
 * updatePiecePosition()
 * @description updates the contraints of a piece with a new polygon
 * @param {func} dispatch the dispatch function
 * @param {Piece} piece the piece to update
 * @param {point} position the new position of the piece
 */
export function updatePiecePosition(dispatch, piece, position) {
    let polygon = getPolygon(position, piece.sides.length, "radius", piece.constraints.radius.value)
    updatePieceWithPolygon(dispatch, piece, polygon)
}


/**
 * updatePieceWithPolygon()
 * @description updates the contraints of a piece with a new polygon
 * @param {func} dispatch the dispatch function
 * @param {Piece} piece the piece to update
 * @param {object} polygon the polygon to update the constraints with
 */
export function updatePieceWithPolygon(dispatch, piece, polygon) {
    // set the constraints of the piece itself
    for (const key of Object.keys(polygon)) {
        if(key !== "sides") {
            dispatch(setPieceConstraintValue({
                pieceId: piece.id,
                constraintId: key, 
                newValue: polygon[key]
            }))
        } 
    }

    // set the constraints of the sides of the piece
    for (let i = 0; i < polygon.sides.length; i++) {
        for (const key of Object.keys(polygon.sides[i])) {
            dispatch(setSideConstraintsValue({
                pieceId: piece.id,
                sideId: i,
                constraintId: key,
                newValue: polygon.sides[i][key]
            }))
        }
    }
}