import { useDispatch } from "react-redux"
import { PointConstraint } from "../../constraints/PointConstraint"
import { Panel } from "../../panel/Panel"
import { pieceAddVertex, pieceSetVertex } from "../../pieces/piecesSlice"



/**
 * VerticesPanel()
 * @description displays the vertices for the piece
 * @param {Piece} piece the piece 
 */
export function VerticesPanel({piece}) {
    const dispatch = useDispatch()

    function renderVertex(vertex, index) {
        return (
            <tr key={index}>
                <td>{index}</td>
                <td>
                    <input 
                        type="number"
                        onChange={(event) => {
                            dispatch(pieceSetVertex({
                                pieceId: piece.id,
                                vertexId: index,
                                vertex: {x: parseInt(event.target.value), y: vertex.y}
                            }))
                        }} 
                        value={vertex.x}
                    ></input>
                </td>
                <td>
                    <input 
                        type="number"
                        onChange={(event) => {
                            dispatch(pieceSetVertex({
                                pieceId: piece.id,
                                vertexId: index,
                                vertex: {x: vertex.x, y: parseInt(event.target.value)}
                            }))
                        }} 
                        value={vertex.y}
                    ></input>
                </td>
            </tr>
        )
    }

    return (
        <Panel title="Vertices">
            <table>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>X</th>
                        <th>Y</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        piece.vertices.map((vertex, index) => {
                            return renderVertex(vertex, index)
                        })
                    }
                    <tr>
                        <td colSpan={3}>
                            <button onClick={() => dispatch(pieceAddVertex({
                                pieceId: piece.id,
                                vertex: {x: 0, y: 0}
                            }))}>+</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
        </Panel>
    )
}