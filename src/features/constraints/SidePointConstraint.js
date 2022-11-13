/**
 * A number constraint is something that describes a puzzle piece with a single value.
 * 
 * 
 * id is how you identify the constraint
 * computed determines if the value for the constraint is computed from other values.
 * 
 */
 import { toggleSideConstraintComputed, setSideConstraintsValue } from "../pieces/piecesSlice"
 import { useDispatch } from 'react-redux';
 import { getDisplayName } from "../util/util";

 export function SidePointConstraint({id, object, piece, updateConstraints, updateComputed}) {

    const dispatch = useDispatch();

    /**
     * onComputedChanged()
     * @description updates the computed value when the checkbox is changed
     */
    function onComputedChanged() {
        dispatch(toggleSideConstraintComputed({
            pieceId: piece.id,
            sideId: object.id,
            constraintId: id
        }))
    }

    /**
     * onChangeY
     * @description updates the y coordinate on change
     * @param {Event} event the change event
     */
    function onChangeY(event) {
        dispatch(setSideConstraintsValue({
            pieceId: piece.id,
            sideId: object.id,
            constraintId: id,
            newValue: {x: object.constraints[id].value.x, y: parseFloat(event.target.value)}
        }))
    }

    /**
     * onChangeX
     * @description updates the x coordinate on change
     * @param {Event} event the change event
     */
    function onChangeX(event) {
        dispatch(setSideConstraintsValue({
            pieceId: piece.id,
            sideId: object.id,
            constraintId: id,
            newValue: {x: parseFloat(event.target.value), y: object.constraints[id].value.y}
        }))
    }

    return (
        <tr>
            <td>{getDisplayName(id)}</td>
            <td>
                x: <input 
                    style={{width: "50px"}} 
                    type="number"  
                    value={object.constraints[id].value.x} 
                    disabled={object.constraints[id].computed}
                    onChange={(event) => {
                        onChangeY(event)
                        updateConstraints(id, object, piece)
                    }}
                />
            </td>
            <td >
                y: 
                <input 
                    style={{width: "50px"}}
                    type="number"  
                    value={object.constraints[id].value.y} 
                    disabled={object.constraints[id].computed}
                    onChange={(event) => {
                        onChangeX(event)
                        updateConstraints(id, object, piece)
                    }}
                />
            </td>
            <td>
                <input 
                    type="checkbox" 
                    checked={object.constraints[id].computed} 
                    onChange={
                        (event) => {
                            onComputedChanged()
                            updateComputed(id, object, piece)
                        }
                    }
                />
            </td>
        </tr>
    )


}