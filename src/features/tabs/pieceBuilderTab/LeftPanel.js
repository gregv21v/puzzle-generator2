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
                        switch(piece.type) {
                            case "sided": 
                                return <ConstraintsPanel piece={piece}></ConstraintsPanel>
                            case "circle": 
                                return <p>Circle</p>
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