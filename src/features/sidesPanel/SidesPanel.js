import React from 'react';
import { Panel } from '../panel/Panel';
import { useDispatch, useSelector } from 'react-redux';
import { createPiece, addSide, removeSide, selectPieces, setConstraintValue, toggleConstraintComputed, moveSideUp, moveSideDown } from '../pieces/piecesSlice';
import { ConstraintsTable } from '../constraints/ConstraintsTable';
import { updatePieceWithPolygon } from '../util/pieceFunctions';
import { getPolygon } from '../util/geometry';
import { dist } from '../util/util';


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
    const constraintsTable = {
        subdivisions: {
            dependencies: ["length", "tabWidth"],
            formula: (length, tabWidth) => {
                console.log("Length: " + length);
                console.log("TabWidth: " + tabWidth);
                return length / tabWidth
            } 
        },
        length: {
            dependencies: ["tabWidth", "subdivisions", "startPoint"],
            formula: (tabWidth, subdivisions, startPoint, endPoint) => {return tabWidth * subdivisions}
        },
        tabWidth: {
            dependencies: ["subdivisions", "length"],
            formula: (subdivisions, length) => {return length / subdivisions}
        },
        tabLength: {
            dependencies: [], 
            formula: () => 0
        },
        startPoint: {
            dependencies: ["startPoint", "endPoint", "length"],
            formula: (startPoint, endPoint, length) => {
                let currentLength = dist(startPoint, endPoint);
                let amountToExtend = currentLength - length;
                return {
                    x: startPoint.x + (endPoint.x - startPoint.x) / currentLength * amountToExtend,
                    y: startPoint.y + (endPoint.y - startPoint.y) / currentLength * amountToExtend,
                }
            }
        },
        endPoint: {
            dependencies: ["startPoint", "endPoint", "length", "subdivisions", "tabWidth"],
            formula: (startPoint, endPoint, length) => {
                // extend the line starting at the start point
                let currentLength = dist(startPoint, endPoint);
                let amountToExtend = currentLength - length;
                return endPoint;
                
                return {
                    x: endPoint.x + (endPoint.x - startPoint.x) / currentLength * amountToExtend,
                    y: endPoint.y + (endPoint.y - startPoint.y) / currentLength * amountToExtend,
                }
                
            }
        }
    }
 

    /**
     * addSideHandler() 
     * @descriptions adds a side to the list of sides when the 
     *  add side button is clicked
     */
    function addSideBtnOnClick() {  

        if(pieces.length <= 0) {
            dispatch(createPiece())
        }

        switch(piece.constraints.type.value) {
            case "sided": 

                let polygon = getPolygon(
                    Object.keys(piece.sides).length + 1,
                    "radius", piece.constraints.radius.value
                ) 

                updatePieceWithPolygon(
                    dispatch, piece,
                    polygon
                )

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
                break;
            default: 
                ;
        }
        
    }


    /**
     * updateComputed()
     * @description updates the computed values of the constraints
     * @param {string} constraintName the name of the constraint
     * @param {side} side the side of the piece
     * @param {piece} piece the piece
     */
    function updateComputed(constraintName, side, piece) {
        // lets start with side.subdivions, side.tabWidth, and side.length
        // one value has to be computed, and the other two have to be set 
        for (const dependency of constraintsTable[constraintName].dependencies) {
            if(side.constraints[dependency].computed) {
                dispatch(toggleConstraintComputed({
                    path: [piece.id, "sides", side.id, dependency]
                }))
            }
        }
    }

    /**
     * updateConstraints()
     * @description updates the constraints of a piece
     * @param {string} constraintName the constraintName of the constraint
     * @param {side} side the side of the piece
     * @param {piece} piece the piece
     */
    function updateConstraints(constraintName, newValue, side, piece) {
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


        // lets start with side.subdivions, side.tabWidth, and side.length
        // one value has to be computed, and the other two have to be set 
        for (const dependency of constraintsTable[constraintName].dependencies) {
            
            if(side.constraints[dependency].computed) {
                let parameters = [];

                // set parameters
                for (let i = 0; i < constraintsTable[dependency].dependencies.length; i++) {
                    const element = constraintsTable[dependency].dependencies[i];

                    if(element === constraintName) {
                        parameters[i] = newValue;
                    } else {
                        parameters[i] = side.constraints[element].value
                    }
                } 

                console.log(constraintsTable[dependency].formula(...parameters));
                
                dispatch(setConstraintValue({
                    path: [piece.id, "sides", side.id, dependency],
                    newValue: constraintsTable[dependency].formula(
                        ...parameters
                    )
                }))
            }
        }
        /*else if(id === "length") {

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
                (piece) ? piece.order.map(key => {
                    return (
                        <Panel title={key} key={key}>

                            <ConstraintsTable
                                root={[piece.id, "sides", key]}
                                constraints={piece.sides[key].constraints}
                                updateComputed={path => 
                                    updateComputed(path[path.length-1], piece.sides[key], piece)
                                }
                                updateConstraints={(path, newValue) => 
                                    updateConstraints(path[path.length-1], newValue, piece.sides[key], piece)
                                }
                            >
                            </ConstraintsTable>

                            <div>
                                <button onClick={() => dispatch(removeSide({
                                    pieceId: piece.id,
                                    sideId: key
                                }))}>-</button>
                            </div>

                            <button onClick={() => dispatch(moveSideUp({
                                pieceId: piece.id, 
                                location: piece.order.indexOf(key)
                            }))}>/\</button>
                            <button onClick={() => dispatch(moveSideDown({
                                pieceId: piece.id, 
                                location: piece.order.indexOf(key)
                            }))}>\/</button>
                        </Panel>
                    )
                }) : ""
            }
            <button onClick={addSideBtnOnClick}>+</button>
        </Panel>
    )
}