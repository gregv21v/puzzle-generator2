import React from 'react';
import { Panel } from '../panel/Panel';
import { useDispatch, useSelector } from 'react-redux';

import { createPiece, addSide, removeSide, selectPieces, toggleSideConstraintComputed, setSideConstraintsValue } from '../pieces/piecesSlice';
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
                            subdivisions: {type: "number", value: 3, computed: false},
                            tabLength: {type: "number", value: 10, computed: false},
                            startIn: {type: "boolean", value: false, computed: false},
                            tabWidth: {type: "number", value: 20, computed: false}
                        }
                    }   
                }))
                break;
            case "free":
                dispatch(addSide({
                    pieceId: piece.id,
                    side: {
                        type: "line",
                        constraints: {
                            startPoint: {type: "point", value: {x: 50, y: 50}, computed: true},
                            endPoint: {type: "point", value: {x: 50, y: 50}, computed: true},
                            subdivisions: {type: "number", value: 3, computed: true},
                            tabLength: {type: "number", value: 10, computed: false},
                            startIn: {type: "boolean", value: false, computed: false},
                            tabWidth: {type: "number", value: 20, computed: false}
                        }
                    }   
                }))
        }
        
    }


    /**
     * updateConstraints()
     * @description updates the constraints of a piece
     * @param {string} id the id of the constraint
     * @param {side} side the side of the piece
     * @param {piece} piece the piece
     */
    function updateConstraints(id, side, piece) {
         /*
            side => constraints
            piece => pieceConstraints
            
            List of constraints:
                side.startPoint 
                side.endPoint
                side.length
                side.subdivisions 
                side.startIn
                side.tabWidth
                side.tabLength
                piece.sideLength
                piece.radius
                piece.rotation
        */

        /**
         * formulas:
         * side.subdivisions = side.length / side.tabWidth
         * side.tabWidth = side.length / side.subdivisions
         * side.length = side.tabWidth * side.subdivisions
         */


        if(id === "subdivisions") {
            // compute the subdivisions

            // make sure length isn't computed
            if(side.constraints.length.computed) {
                dispatch(toggleSideConstraintComputed({
                    pieceId: piece.id,
                    sideId: side.id, 
                    constraintId: "length"
                }))
            }

            // make sure tab width isn't computed
            if(side.constraints.tabWidth.computed) {
                dispatch(toggleSideConstraintComputed({
                    pieceId: piece.id,
                    sideId: side.id, 
                    constraintId: "tabWidth"
                }))
            }

            if(side.constraints.subdivisions.computed) {
                dispatch(setSideConstraintsValue({
                    pieceId: piece.id,
                    sideId: side.id,
                    constraintId: id,
                    newValue: side.constraints.length.value / side.constraints.tabWidth.value
                }))
            }
        } /*else if(id === "length") {

            // make sure length isn't computed
            if(side.constraints.subdivisions.computed) {
                dispatch(toggleSideConstraintComputed({
                    pieceId: piece.id,
                    sideId: side.id, 
                    constraintId: "subdivisions"
                }))
            }

            // make sure tab width isn't computed
            if(side.constraints.tabWidth.computed) {
                dispatch(toggleSideConstraintComputed({
                    pieceId: piece.id,
                    sideId: side.id, 
                    constraintId: "tabWidth"
                }))
            }

            if(side.constraints.length.computed) {
                dispatch(setSideConstraintsValue({
                    pieceId: piece.id,
                    sideId: side.id,
                    constraintId: id,
                    newValue: side.constraints.length.value / side.constraints.tabWidth.value
                }))
            }
            // compute the tabWidth
            tabWidth = constraints.length / constraints.subdivisions;
        } else if(constraints.length && constraints.length.computed) {
            // compute the length of the side
            length = constraints.tabWidth * constraints.subdivisions;
        } else if(constraints.startPoint && constraints.startPoint.computed) {
            // extend the line starting at the start point
            let currentLength = dist(constraints.startPoint.value, constraints.endPoint.value);
            let amountToExtend = currentLength - length;
            let startPoint = {
                x: startPoint.x - (endPoint.x - startPoint.x) / currentLength * amountToExtend,
                y: startPoint.y - (endPoint.y - startPoint.y) / currentLength * amountToExtend,
            }
        } else if(constraints.endPoint && constraints.endPoint.computed) {
            // extend the line starting at the start point
            let currentLength = dist(constraints.endPoint.value, constraints.endPoint.value);
            let amountToExtend = currentLength - length;
            let endPoint = {
                x: endPoint.x - (endPoint.x - endPoint.x) / currentLength * amountToExtend,
                y: endPoint.y - (endPoint.y - endPoint.y) / currentLength * amountToExtend,
            }
        }*/
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
                                        <th colSpan={2}>Property</th>
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
                                                            updateConstraints={updateConstraints}
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
                                                            updateConstraints={updateConstraints}
                                                        >
                                                        </BooleanConstraint>
                                                    )
                                                case "point": 
                                                    return (
                                                        <PointConstraint
                                                            key={key}
                                                            id={key}
                                                            side={side}
                                                            piece={piece}
                                                            updateConstraints={updateConstraints}
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