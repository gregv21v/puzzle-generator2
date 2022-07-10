/**
 * LeftPanel - the left panel of the piece builder tab
 */

import { useDispatch, useSelector } from 'react-redux';
import { selectTool, setTool } from './toolSlice';

export function ToolPanel({}) {
    const dispatch = useDispatch()
    const tool = useSelector(selectTool)

    function selectionTool() {
        dispatch(setTool(0))
    }

    function drawByRadiusTool() {
        dispatch(setTool(1))
    }

    function drawBySideLengthTool() {
        dispatch(setTool(2))
    }

    function freeHandDrawTool() {
        dispatch(setTool(3))
    }

    function editTool() {
        dispatch(setTool(4))
    }

    function lineTool() {
        dispatch(setTool(5))
    }
    
    return (
        <div>
            <p>Tool selected: {
                ["Selection", "Draw By Radius", "Draw By Side Length", "Free Hand", "Edit", "Line"][tool]
            }</p>
            <button onClick={selectionTool}>Select</button>
            <button onClick={drawByRadiusTool} disabled>
                Draw By Radius (NYI)
            </button>
            <button onClick={drawBySideLengthTool} disabled>
                Draw By Side Length (NYI)
            </button>
            <button onClick={freeHandDrawTool}>Free Hand Draw (NYI)</button>
            <button onClick={editTool} disabled>Edit (NYI) </button>
            <button onClick={lineTool} disabled> Line (NYI) </button>
        </div>
    )
}