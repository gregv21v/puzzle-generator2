import React from 'react';
import { Panel } from '../../panel/Panel';
import { useDispatch, useSelector } from 'react-redux';
import { 
    createPiece, removeSide, selectPieces, setConstraintValue, 
    toggleConstraintComputed, pieceAddEdge } from '../../pieces/piecesSlice';
import { updatePieceWithPolygon } from '../../util/pieceFunctions';
import { getPolygon } from '../../util/geometry';
import { ConstraintsTable } from '../../constraints/ConstraintsTable';
import { generateEdge } from "../../util/predefinedPieces"


/**
 * EdgesPanel()
 * @description constructs the EdgesPanel component
 * @param {Props} props the props of the component
 *  @param {String} title the title of the side panel
 *  @param {Object} piece the piece currently selected 
 * @returns 
 */
export function EdgesPanel({piece}) {
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
        }
    }
 

    /**
     * addEdgeButtonClick() 
     * @descriptions adds a side to the list of sides when the 
     *  add side button is clicked
     */
    function addEdgeButtonClick() {  

        if(pieces.length <= 0) {
            dispatch(createPiece())
        }

        switch(piece.constraints.type.value) {
            case "shape2":
                dispatch(pieceAddEdge({
                    pieceId: piece.id,
                    edge: generateEdge(0, 0, 0)
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
        /*for (const dependency of constraintsTable[constraintName].dependencies) {
            if(side.constraints[dependency].computed) {
                dispatch(toggleConstraintComputed({
                    path: [piece.id, "sides", side.id, dependency]
                }))
            }
        }*/
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
        /*for (const dependency of constraintsTable[constraintName].dependencies) {
            
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
        }*/
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
        <Panel title="Edges">
            {
                (piece) ? piece.edges.map((edge, index) => {
                    return (
                        <Panel title={index} key={index}>

                            <ConstraintsTable
                                root={[piece.id, "edges", index]}
                                constraints={piece.edges[index].constraints}
                                updateComputed={path => 
                                    updateComputed(path[path.length-1], piece.edges[index], piece)
                                }
                                updateConstraints={(path, newValue) => 
                                    updateConstraints(path[path.length-1], newValue, piece.edges[index], piece)
                                }
                            >
                            </ConstraintsTable>

                            <div>
                                <button onClick={() => dispatch(removeSide({
                                    pieceId: piece.id,
                                    sideId: index
                                }))}>-</button>
                            </div>
                        </Panel>
                    )
                }) : ""
            }
            <button onClick={addEdgeButtonClick}>+</button>
        </Panel>
    )
}