import { ConstraintsPanel } from "../../constraintsPanel/ConstraintsPanel";
import { ToolPanel } from "../../tool/ToolPanel";
import { PiecesPanel } from "./PiecesPanel";

/**
 * LeftPanel - the left panel of the piece builder tab
 */
export function LeftPanel({piece}) {
    return (
        <div>
            <ToolPanel></ToolPanel>
            <PiecesPanel></PiecesPanel>

            {
                (() => {
                    if(piece)
                        switch(piece.constraints.type.value) {
                            case "sided": 
                            case "circle":
                            case "free":
                            case "rectangle":
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