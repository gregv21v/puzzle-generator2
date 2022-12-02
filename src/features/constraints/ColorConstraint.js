/**
 * A color constraint is something that describes the color.
 * 
 * 
 * id is how you identify the constraint
 * computed determines if the value for the constraint is computed from other values.
 * 
 */
 import { setConstraintValue, toggleConstraintComputed, toggleConstraintEnabled } from "../pieces/piecesSlice"
 import { useDispatch } from 'react-redux';
 import { getDisplayName } from "../util/util";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
 
export function ColorConstraint({path, constraint, parent, updateConstraints, updateComputed}) {

    const dispatch = useDispatch();
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

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
     * @param {Event} color the new color
     */
    function onConstraintChanged(color) {
        dispatch(setConstraintValue({
            path,
            newValue: color
        }))
    }

    return (
        <tr>
            <td style={{fontSize: 10}}>{getDisplayName(path[path.length-1])}:</td>
            <td colSpan={2}>
                <div 
                    style={{
                        display: "inline-block",
                        width: "100%",
                        userSelect: "none"
                    }} 
                    onClick={() => setDisplayColorPicker(!displayColorPicker)}
                >
                    <p>{constraint.value}</p>
                </div>
                
                <HexColorPicker
                    style={{display: (displayColorPicker) ? "" : "none"}} 
                    color={constraint.value}
                    disabled={constraint.computed || !constraint.enabled}
                    onChange={(color) => {
                        onConstraintChanged(color)
                        //updateConstraints(event.target.value, id, 
                    }}
                ></HexColorPicker>
            </td>
            <td>
                <input 
                    type="checkbox" 
                    checked={constraint.computed} 
                    disabled={!constraint.enabled}
                    onChange={
                        (event) => {
                            onComputedChanged()
                           // updateComputed(id, piece)
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