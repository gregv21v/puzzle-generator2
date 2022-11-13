/**
 * A number constraint is something that describes a puzzle piece with a single value.
 * 
 * 
 * id is how you identify the constraint
 * computed determines if the value for the constraint is computed from other values.
 * 
 */
 import { setConstraintValue, setPieceConstraintValue, toggleConstraintComputed, togglePieceConstraintComputed } from "../pieces/piecesSlice"
 import { useDispatch } from 'react-redux';
 import { getDisplayName } from "../util/util";

 export function PointConstraint({path, constraint, parent, updateConstraints, updateComputed}) {

    const dispatch = useDispatch();

    /**
     * onComputedChanged()
     * @description updates the computed value when the checkbox is changed
     */
    function onComputedChanged() {
        dispatch(toggleConstraintComputed({
            path
        }))
    }

    /**
     * onChangeY
     * @description updates the y coordinate on change
     * @param {Event} event the change event
     */
    function onChangeY(event) {
        dispatch(setConstraintValue({
            path,
            newValue: {x: constraint.value.x, y: parseFloat(event.target.value)}
        }))
    }

    /**
     * onChangeX
     * @description updates the x coordinate on change
     * @param {Event} event the change event
     */
    function onChangeX(event) {
        dispatch(setConstraintValue({
            path,
            newValue: {x: parseFloat(event.target.value), y: constraint.value.y}
        }))
    }

    return (
        <tr>
            <td style={{fontSize: 10}}>{getDisplayName(path[path.length-1])}:</td>
            <td>
                x: <input 
                    style={{width: "50px"}} 
                    type="number"  
                    value={constraint.value.x} 
                    disabled={constraint.computed}
                    onChange={(event) => {
                        onChangeX(event)
                        //updateConstraints({x: parseFloat(event.target.value), y: constraint.value.y}, id, 
                    }}
                />
            </td>
            <td >
                y: 
                <input 
                    style={{width: "50px"}}
                    type="number"  
                    value={constraint.value.y} 
                    disabled={constraint.computed}
                    onChange={(event) => {
                        onChangeY(event)
                        //updateConstraints({x: constraint.value.x, y: parseFloat(event.target.value)}, id, 
                    }}
                />
            </td>
            <td>
                <input 
                    type="checkbox" 
                    checked={constraint.computed} 
                    onChange={
                        (event) => {
                            onComputedChanged()
                            //updateComputed(id, 
                        }
                    }
                />
            </td>
        </tr>
    )


}