/**
 * RightPanel - the right panel of the piece builder tab
 */

import { SidesPanel } from "../../sidesPanel/SidesPanel"

export function RightPanel({piece}) {


    return (
        <div>
            <SidesPanel title="Sides" piece={piece} />
        </div>
    )
}