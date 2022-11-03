import React from 'react';
import { Panel } from '../panel/Panel';
import { useDispatch, useSelector } from 'react-redux';

import { createPiece, addSide, removeSide, selectPieces } from '../pieces/piecesSlice';
import { NumberConstraint } from '../constraints/NumberConstraint';
import { BooleanConstraint } from '../constraints/BooleanConstraint';
import { PointConstraint } from '../constraints/PointConstraint';


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

        switch(piece.type) {
            case "sided": 
                dispatch(addSide({
                    pieceId: piece.id,
                    side: {
                        type: "line",
                        constraints: {
                            subdivisions: 4, tabLength: 10, startIn: false
                        }
                    }   
                }))
                break;
            case "free":
                dispatch(addSide({
                    pieceId: piece.id,
                    side: {
                        type: "line",
                        start: {x: 0, y: 0},
                        end: {x: 0, y: 0},
                        constraints: {
                            subdivisions: 4, tabLength: 10, startIn: false
                        }
                    }   
                }))
        }
        
    }


    return (
        <Panel title={title}>
            {
                (piece) ? piece.sides.map(side => {
                    return (
                        <Panel title={side.id} key={side.id}>

                            <table style={{fontSize: 10}}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Property</th>
                                        <th>Computed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(side.constraints).map(key => {
                                            switch(side.constraints[key].type) {
                                                case "number": 
                                                    return (
                                                        <NumberConstraint 
                                                            key={key} 
                                                            id={key} 
                                                            side={side} 
                                                            piece={piece}
                                                            onChangeHandler={(sideId, event) => {
                                                                console.log("Test");
                                                            }}
                                                        >
                                                        </NumberConstraint>
                                                    )
                                                case "boolean": 
                                                    return (
                                                        <BooleanConstraint
                                                            key={key}
                                                            id={key}
                                                            side={side}
                                                            piece={piece}
                                                            onChangeHandler={(sideId, event) => {
                                                                console.log("Boolean Constraint");
                                                            }}
                                                        >
                                                        </BooleanConstraint>
                                                    )
                                                case "boolean": 
                                                    return (
                                                        <PointConstraint
                                                            key={key}
                                                            id={key}
                                                            side={side}
                                                            piece={piece}
                                                            onChangeX={(sideId, event) => {
                                                                console.log("Boolean Constraint");
                                                            }}
                                                            onChangeY={(sideId, event) => {
                                                                console.log("Boolean Constraint");
                                                            }}
                                                        >
                                                        </PointConstraint>
                                                    )
                                            }
                                        })
                                    }
                                </tbody>
                            </table>

                            <div>
                                <button onClick={() => dispatch(removeSide({
                                    pieceId: piece.id,
                                    sideId: side.id
                                }))}>-</button>
                            </div>
                        </Panel>
                    )
                }) : ""
            }
            <button onClick={addSideBtnOnClick}>+</button>
        </Panel>
    )
}