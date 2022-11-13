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
 
export function PieceNumberConstraint({id, piece, updateConstraints, updateComputed}) {

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
     * onConstraintChanged()
     * @description updates the constraint when the text box changes
     * @param {Event} event the change event
     */
    function onConstraintChanged(event) {
        dispatch(setPieceConstraintValue({
            pieceId: piece.id,
            constraintId: id,
            newValue: parseFloat(event.target.value)
        }))
    }

    return (
        <tr>
            <td style={{fontSize: 10}}>{getDisplayName(id)}:</td>
            <td colSpan={2}>
                <input 
                    type="number"  
                    value={piece.constraints[id].value} 
                    disabled={piece.constraints[id].computed}
                    onChange={(event) => {
                        onConstraintChanged(event)
                        updateConstraints(event, id, piece)
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