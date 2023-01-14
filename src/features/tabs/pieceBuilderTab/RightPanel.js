/**
 * RightPanel - the right panel of the piece builder tab
 */

import { SidesPanel } from "../../sidesPanel/SidesPanel"
import { EdgesPanel } from "./EdgesPanel"

export function RightPanel({piece}) {

    return (
        <div>
            {
                (piece && piece.sides) ? <SidesPanel key="sides" piece={piece} /> : <p>This piece has no sides</p>
            }
            {
                (piece && piece.edges) ? <EdgesPanel key="edges" piece={piece} /> : <p>This piece has no edges</p>
            } 
        </div>
    )
}