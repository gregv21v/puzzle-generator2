import { setConstraintValue } from "../pieces/piecesSlice";
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
    let polygon = getPolygon(piece.constraints.position.value, Object.values(piece.sides).length, constraintName, value);

    console.log("Polygon: ")
    console.log(polygon);
    
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
    let polygon = getPolygon(position, Object.values(piece.sides).length, "radius", piece.constraints.radius.value)
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
            dispatch(setConstraintValue({
                path: [piece.id, key],
                newValue: polygon[key]
            }))
        } 
    }

    // set the constraints of the sides of the piece
    for (const sideKey of Object.keys(polygon.sides)) {
        for (const constraintKey of Object.keys(polygon.sides[sideKey])) {
            dispatch(setConstraintValue({
                path: [piece.id, "sides", sideKey, constraintKey],
                newValue: polygon.sides[sideKey][constraintKey]
            }))
        }
    }
}