/**
 * A number constraint is something that describes a puzzle piece with a single value.
 * 
 * 
 * id is how you identify the constraint
 * computed determines if the value for the constraint is computed from other values.
 * 
 */

import { toggleSideConstraintComputed, toggleSideConstraintValue } from "../pieces/piecesSlice"
import { useDispatch } from 'react-redux';
import { getDisplayName } from "../util/util";


 export function BooleanConstraint({id, side, piece, updateConstraints}) {

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
     * @description updates the constraint when the check box changes
     * @param {Event} event the change event
     */
    function onConstraintChanged(event) {
        dispatch(toggleSideConstraintValue({
            pieceId: piece.id,
            sideId: side.id,
            constraintId: id
        }))
    }

    return (
        <tr>
            <td>{getDisplayName(id)}</td>
            <td colSpan={2}>
                <input 
                    type="checkbox"  
                    value={side.constraints[id].value} 
                    disabled={side.constraints[id].computed}
                    onChange={(event) => {
                        onConstraintChanged(event)
                        updateConstraints(id, side, piece)
                    }}
                />
            </td>
            <td>
                <input 
                    type="checkbox" 
                    value={side.constraints[id].computed} 
                    onChange={
                        (event) => {
                            onComputedChanged()
                            updateConstraints(id, side, piece)
                        }
                    }
                />
            </td>
        </tr>
    )


}