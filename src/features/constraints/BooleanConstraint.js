/**
 * A number constraint is something that describes a puzzle piece with a single value.
 * 
 * 
 * @param {Array} path is the path to the constraint
 * computed determines if the value for the constraint is computed from other values.
 * 
 */

import { toggleConstraintComputed, toggleConstraintValue, toggleConstraintEnabled } from "../pieces/piecesSlice"
import { useDispatch } from 'react-redux';
import { getDisplayName } from "../util/util";


export function BooleanConstraint({path, constraint, parent, updateConstraints, updateComputed}) {

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
     * @description updates the constraint when the check box changes
     * @param {Event} event the change event
     */
    function onConstraintChanged() {
        dispatch(toggleConstraintValue({path}))
    }

    return (
        <tr>
            <td style={{fontSize: 10}}>{getDisplayName(path[path.length-1])}:</td>
            <td colSpan={2}>
                <input 
                    type="checkbox"  
                    value={constraint.value} 
                    disabled={constraint.computed || !constraint.enabled}
                    onChange={(event) => {
                        onConstraintChanged()
                        //updateConstraints(path, constraint, parent)
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
                            //updateComputed(path, constraint, parent)
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