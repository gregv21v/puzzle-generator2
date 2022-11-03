/**
 * RightPanel - the right panel of the piece builder tab
 */

import { SidesPanel } from "../../sidesPanel/SidesPanel"

export function RightPanel({piece}) {


    return (
        <div>
            {
                (piece && (piece.type === "sided" || piece.type === "free")) ? <SidesPanel title="Sides" piece={piece} /> : <p>No info</p>
            }
        </div>
    )
}