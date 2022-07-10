import { ConstraintsPanel } from "../../constraintsPanel/ConstraintsPanel";
import { ToolPanel } from "../../tool/ToolPanel";

/**
 * LeftPanel - the left panel of the piece builder tab
 */
export function LeftPanel({piece}) {
    return (
        <div>
            <ToolPanel></ToolPanel>
            <ConstraintsPanel piece={piece}></ConstraintsPanel>
        </div>
    )
}