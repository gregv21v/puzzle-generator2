import React from 'react';
import { Panel } from '../panel/Panel';
import { useDispatch, useSelector } from 'react-redux';

import { createPiece, addSide, removeSide, selectPieces, setSideConstraints } from '../pieces/piecesSlice';


/**
 * SidePanel()
 * @description constructs the SidePanel component
 * @param {Props} props the props of the component
 *  @param {String} title the title of the side panel
 *  @param {Object} piece the piece currently selected 
 * @returns 
 */
export function SidesPanel({title, piece}) {
    const dispatch = useDispatch();
    const pieces = useSelector(selectPieces)
    


    /**
     * addSideHandler() 
     * @descriptions adds a side to the list of sides when the 
     *  add side button is clicked
     */
    function addSideBtnOnClick() {  


        if(pieces.length <= 0) {
            dispatch(createPiece())
        }

        dispatch(addSide({
            pieceId: piece.id,
            side: {
                constraints: {
                    subdivisions: 3, tabLength: 10, startIn: false
                }
            }   
        }))
    }


    /**
     * onTabLengthChange()
     * @description updates the sides tabLength value when the input field is changed
     * @param {number} sideId the id of the side to change the tabLength of 
     * @param {Event} event the on change event
     */
    function onTabLengthChange(sideId, event) {
        console.log(sideId);
        dispatch(setSideConstraints({
            pieceId: piece.id,
            sideId: sideId,
            constraints: {
                tabLength: event.target.value
            }
        }))
    }

    /**
     * onSubdivisionsChange()
     * @description updates the sides subdivisions value when the input field is changed
     * @param {number} sideId the id of the side to change the subdivisions of 
     * @param {Event} event the on change event
     */
    function onSubdivisionsChange(sideId, event) {
        dispatch(setSideConstraints({
            pieceId: piece.id,
            sideId: sideId,
            constraints: {
                subdivisions: event.target.value
            }
        }))
    }

    /**
     * onStartInChange()
     * @description updates the sides start in value when the input field is changed
     * @param {number} sideId the id of the side to change the start in of 
     * @param {Event} event the on change event
     */
    function onStartInChange(sideId, event) {
        dispatch(setSideConstraints({
            pieceId: piece.id,
            sideId: sideId,
            constraints: {
                startIn: event.target.value
            }
        }))
    }

    return (
        <Panel title={title}>
            {
                (piece) ? piece.sides.map(side => {
                    return (
                        <Panel title={side.id} key={side.id}>
                            <div>
                                <label htmlFor="TabLength">
                                    Tab Length (px): 
                                    <input 
                                        type="number"  
                                        value={side.constraints.tabLength} 
                                        onChange={(event) => onTabLengthChange(side.id, event)}
                                    />
                                </label>
                            </div>
                            
                            <div>
                                <label htmlFor="subdivisions">
                                    Subdivision: 
                                    <input 
                                        type="number" 
                                        value={side.constraints.subdivisions} 
                                        onChange={(event) => onSubdivisionsChange(side.id, event)}
                                    />
                                </label>
                            </div>

                            <div>
                                <label htmlFor="startIn">
                                    Start In: 
                                    <input 
                                        type="checkbox" 
                                        value={side.constraints.startIn} 
                                        onChange={(event) => onStartInChange(side.id, event)}
                                    />
                                </label> 
                            </div>

                            <div>
                                <button onClick={() => dispatch(removeSide(side.id))}>-</button>
                            </div>
                        </Panel>
                    )
                }) : ""
            }
            <button onClick={addSideBtnOnClick}>+</button>
        </Panel>
    )
}