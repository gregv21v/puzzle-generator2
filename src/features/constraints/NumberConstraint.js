/**
 * A number constraint is something that describes a puzzle piece with a single value.
 * 
 * 
 * id is how you identify the constraint
 * computed determines if the value for the constraint is computed from other values.
 * 
 */
 import { toggleSideConstraintComputed } from "../pieces/piecesSlice"
 import { useDispatch } from 'react-redux';

export function NumberConstraint({id, side, piece, onChangeHandler}) {

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

    return (
        <tr>
            <td>{side.constraints[id].displayName}</td>
            <td>
                <input 
                    type="number"  
                    value={side.constraints[id].value} 
                    disabled={side.constraints[id].computed}
                    onChange={(event) => onChangeHandler(side.id, event)}
                />
            </td>
            <td>
                <input 
                    type="checkbox" 
                    value={side.constraints[id].computed} 
                    onChange={
                        (event) => {
                            onComputedChanged()
                        }
                    }
                />
            </td>
        </tr>
    )


}