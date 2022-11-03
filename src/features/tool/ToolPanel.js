/**
 * LeftPanel - the left panel of the piece builder tab
 */

import { useDispatch, useSelector } from 'react-redux';
import { selectTool, setTool } from './toolSlice';

export function ToolPanel({}) {
    const dispatch = useDispatch()
    const tool = useSelector(selectTool)

    /**
     * selectionTool()
     * @description sets the tool to the selection tool
     */
    function selectionTool() {
        dispatch(setTool("Selection"))
    }

    /**
     * shapeTool()
     * @description sets the tool to the shape tool
     */
    function shapeTool() {
        dispatch(setTool("Shape"))
    }

    /**
     * drawByRadiusTool()
     * @description sets the tool to the draw by radius tool
     */
    function drawByRadiusTool() {
        dispatch(setTool("DrawByRadius"))
    }

    /**
     * drawBySideLengthTool()
     * @description sets the tool to the draw by side length tool
     */
    function drawBySideLengthTool() {
        dispatch(setTool("DrawBySideLength"))
    }

    /**
     * freeHandDrawTool()
     * @description sets the tool to the free hand tool
     */
    function freeHandDrawTool() {
        dispatch(setTool("FreeHandDraw"))
    }

    /**
     * editTool()
     * @description sets the tool to the edit tool
     */
    function editTool() {
        dispatch(setTool("Edit"))
    }

    /**
     * lineTool()
     * @description sets the tool to the line tool
     */
    function lineTool() {
        dispatch(setTool("Line"))
    }


    /**
     * circleTool()
     * @description sets the tool to the circle tool
     */
    function circleTool() {
        dispatch(setTool("Circle"))
    }
    
    return (
        <div>
            <p>Tool selected: {
                tool
            }</p>
            <button onClick={shapeTool}>Shape Tool</button>
            <button onClick={selectionTool}>Select</button>
            <button onClick={drawByRadiusTool} disabled>
                Draw By Radius (NYI)
            </button>
            <button onClick={drawBySideLengthTool} disabled>
                Draw By Side Length (NYI)
            </button>
            <button onClick={freeHandDrawTool}>Free Hand Draw</button>
            <button onClick={editTool} disabled>Edit (NYI) </button>
            <button onClick={lineTool} disabled> Line (NYI) </button>
            <button onClick={circleTool}> Circle </button>
        </div>
    )
}