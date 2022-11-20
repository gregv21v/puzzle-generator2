/**
 * A number constraint is something that describes a puzzle piece with a single value.
 * 
 * 
 * id is how you identify the constraint
 * computed determines if the value for the constraint is computed from other values.
 * 
 */
 import { setConstraintValue, toggleConstraintComputed, toggleConstraintEnabled } from "../pieces/piecesSlice"
 import { useDispatch } from 'react-redux';
 import { getDisplayName } from "../util/util";
 
export function IntegerConstraint({path, constraint, parent, updateConstraints, updateComputed}) {

    const dispatch = useDispatch();

    /**
     * onComputedChanged()
     * @description updates the computed value when the checkbox is changed
     */
    function onComputedChanged() {
        dispatch(toggleConstraintComputed({path}))
    }

    /**
     * onEnabledChanged() 
     * @description updates the constraint when enabled is changed
     */
    function onEnabledChanged() {
        dispatch(toggleConstraintEnabled({
            path
        }))
    }

    /**
     * onConstraintChanged()
     * @description updates the constraint when the text box changes
     * @param {Event} event the change event
     */
    function onConstraintChanged(event) {
        dispatch(setConstraintValue({
            path,
            newValue: parseInt(event.target.value)
        }))
    }

    return (
        <tr>
            <td style={{fontSize: 10}}>{getDisplayName(path[path.length-1])}:</td>
            <td colSpan={2}>
                <input 
                    type="number"  
                    value={parseInt(constraint.value)} 
                    disabled={constraint.computed || !constraint.enabled}
                    onChange={(event) => {
                        onConstraintChanged(event)

                        // updateConstraints(path, newValue,)
                        updateConstraints(path, parseInt(event.target.value))
                    }}
                />
            </td>
            <td>
                <input 
                    type="checkbox" 
                    checked={constraint.computed} 
                    disabled={!constraint.enabled}
                    onChange={
                        (event) => {
                            onComputedChanged()
                            updateComputed(path)
                        }
                    }
                />
            </td>

            <td>
                <input 
                    type="checkbox" 
                    checked={!constraint.enabled} 
                    onChange={
                        (event) => {
                            onEnabledChanged()
                            //updateComputed(path, constraint, parent)
                        }
                    }
                />
            </td>
        </tr>
    )


}