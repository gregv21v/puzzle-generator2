import { useDispatch, useSelector } from "react-redux";
import { Panel } from "../../panel/Panel";
import { renamePiece, selectPieces } from "../../pieces/piecesSlice";



export function PiecesPanel() {
    const pieces = useSelector(selectPieces);
    const dispatch = useDispatch()


    function onIdChange(event, pieceId) {
        dispatch(renamePiece({
            pieceId,
            name: event.target.value
        }))
    }

    return (
        <Panel title="Pieces">
            <div>
                {
                    Object.keys(pieces).map(key => {
                        return (
                            <div
                                key={key} 
                                style={{
                                    background: (pieces[key].selected) ? "grey" : "darkgrey", 
                                    listStyleType: "none", 
                                }}
                                onClick={(event) => console.log("Clicked " + key)}
                            >
                                <input type="text" value={pieces[key].name} onChange={event => onIdChange(event, key)}></input>
                            </div>
                        )
                    })
                }
            </div>
        </Panel>
    )

} 