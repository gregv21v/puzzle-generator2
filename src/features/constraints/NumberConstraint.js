/**
 * A number constraint is something that describes a puzzle piece with a single value.
 * 
 * 
 * id is how you identify the constraint
 * computed determines if the value for the constraint is computed from other values.
 * 
 */
 import { setSideConstraintsValue, toggleSideConstraintComputed } from "../pieces/piecesSlice"
 import { useDispatch } from 'react-redux';
 import { getDisplayName } from "../util/util";
 
export function NumberConstraint({id, side, piece, updateConstraints, updateComputed}) {

    const dispatch = useDispatch();

    /**
     * onComputedChanged()
     * @description updates the computed value when the checkbox is changed
     */
    function onComputedChanged() {
        dispatch(toggleSideConstraintComputed({
            pieceId: piece.id,
            sideId: side.id,
            constraintId: id
        }))
    }

    /**
     * onConstraintChanged()
     * @description updates the constraint when the text box changes
     * @param {Event} event the change event
     */
    function onConstraintChanged(event) {
        dispatch(setSideConstraintsValue({
            pieceId: piece.id,
            sideId: side.id,
            constraintId: id,
            newValue: parseInt(event.target.value)
        }))
    }

    return (
        <tr>
            <td>{getDisplayName(id)}</td>
            <td colSpan={2}>
                <input 
                    type="number"  
                    value={side.constraints[id].value} 
                    disabled={side.constraints[id].computed}
                    onChange={(event) => {
                        onConstraintChanged(event)
                        updateConstraints(event, id, side, piece)
                    }}
                />
            </td>
            <td>
                <input 
                    type="checkbox" 
                    checked={side.constraints[id].computed} 
                    onChange={
                        (event) => {
                            onComputedChanged()
                            updateComputed(id, side, piece)
                        }
                    }
                />
            </td>
        </tr>
    )


}