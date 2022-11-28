import { useDispatch, useSelector } from "react-redux";
import { Panel } from "../../panel/Panel";
import { deselectAllPieces, renamePiece, selectPieceAction, selectPieces, selectPiecesAction } from "../../pieces/piecesSlice";
import { setSelectedPieceId } from "../../selectedPieceId/selectedPieceIdSlice";



export function PiecesPanel() {
    const pieces = useSelector(selectPieces);
    const dispatch = useDispatch()


    /**
     * onIdChange()
     * @description determines what happens when an id is changed
     * @param {Event} event the event of the id change
     * @param {string} pieceId the id of the piece that is being changed
     */
    function onIdChange(event, pieceId) {
        dispatch(renamePiece({
            pieceId,
            name: event.target.value
        }))
    }


    /**
     * onPieceClicked()
     * @description determines what happens when a piece is clicked  
     * @param {Event} event the event
     * @param {string} pieceId the pieces id
     */
    function onPieceClicked(pieceId) {
        console.log(pieceId);
        dispatch(selectPieceAction(pieceId));
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
                                onClick={() => onPieceClicked(key)}
                            >
                                <input 
                                    type="text" 
                                    value={pieces[key].name} 
                                    onChange={event => onIdChange(event, key)}
                                ></input>
                            </div>
                        )
                    })
                }
            </div>
        </Panel>
    )

} 