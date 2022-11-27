/**
 * RightPanel - the right panel of the piece builder tab
 */

import { SidesPanel } from "../../sidesPanel/SidesPanel"

export function RightPanel({piece}) {


    return (
        <div>
            {
                (piece && piece.sides) ? <SidesPanel title="Sides" piece={piece} /> : <p>This piece has now sides</p>
            }
        </div>
    )
}