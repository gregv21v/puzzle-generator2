/**
 * A number constraint is something that describes a puzzle piece with a single value.
 * 
 * 
 * id is how you identify the constraint
 * computed determines if the value for the constraint is computed from other values.
 * 
 */
 import { setPieceConstraintValue, togglePieceConstraintComputed } from "../pieces/piecesSlice"
 import { useDispatch } from 'react-redux';
 import { getDisplayName } from "../util/util";

 export function PiecePointConstraint({id, piece, updateConstraints, updateComputed}) {

    const dispatch = useDispatch();

    /**
     * onComputedChanged()
     * @description updates the computed value when the checkbox is changed
     */
    function onComputedChanged() {
        dispatch(togglePieceConstraintComputed({
            pieceId: piece.id,
            constraintId: id
        }))
    }

    /**
     * onChangeY
     * @description updates the y coordinate on change
     * @param {Event} event the change event
     */
    function onChangeY(event) {
        dispatch(setPieceConstraintValue({
            pieceId: piece.id,
            constraintId: id,
            newValue: {x: piece.constraints[id].value.x, y: parseFloat(event.target.value)}
        }))
    }

    /**
     * onChangeX
     * @description updates the x coordinate on change
     * @param {Event} event the change event
     */
    function onChangeX(event) {
        dispatch(setPieceConstraintValue({
            pieceId: piece.id,
            constraintId: id,
            newValue: {x: parseFloat(event.target.value), y: piece.constraints[id].value.y}
        }))
    }

    return (
        <tr>
            <td>{getDisplayName(id)}</td>
            <td>
                x: <input 
                    style={{width: "50px"}} 
                    type="number"  
                    value={piece.constraints[id].value.x} 
                    disabled={piece.constraints[id].computed}
                    onChange={(event) => {
                        onChangeX(event)
                        updateConstraints({x: parseFloat(event.target.value), y: piece.constraints[id].value.y}, id, piece)
                    }}
                />
            </td>
            <td >
                y: 
                <input 
                    style={{width: "50px"}}
                    type="number"  
                    value={piece.constraints[id].value.y} 
                    disabled={piece.constraints[id].computed}
                    onChange={(event) => {
                        onChangeY(event)
                        updateConstraints({x: piece.constraints[id].value.x, y: parseFloat(event.target.value)}, id, piece)
                    }}
                />
            </td>
            <td>
                <input 
                    type="checkbox" 
                    checked={piece.constraints[id].computed} 
                    onChange={
                        (event) => {
                            onComputedChanged()
                            updateComputed(id, piece)
                        }
                    }
                />
            </td>
        </tr>
    )


}