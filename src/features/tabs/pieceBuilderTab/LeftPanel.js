import { ConstraintsPanel } from "../../constraintsPanel/ConstraintsPanel";
import { ToolPanel } from "../../tool/ToolPanel";

/**
 * LeftPanel - the left panel of the piece builder tab
 */
export function LeftPanel({piece}) {
    return (
        <div>
            <ToolPanel></ToolPanel>

            {
                (() => {
                    if(piece)
                        switch(piece.constraints.type.value) {
                            case "sided": 
                            case "circle":
                            case "free":
                                return <ConstraintsPanel piece={piece}></ConstraintsPanel>
                            default: 
                                return <div></div>
                        }
                    else 
                        return <div></div>
                })()
            }
        </div>
    )
}