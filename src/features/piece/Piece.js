import * as d3 from "d3"
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { deselectAllPieces, movePiece, moveSideConstraintPoint, selectPiecesAction, setPieceConstraintValue, setSideConstraintsValue } from '../pieces/piecesSlice';
import { setSelectedPieceId } from "../selectedPieceId/selectedPieceIdSlice";
import { createPathForArcSide, createPathForArcToSide, createPathForLineSide } from "../util/draw";
import { getPolygon } from "../util/geometry";
import { updatePiecePosition, updatePieceWithPolygon } from "../util/pieceFunctions";



/**
 * Piece
 * @description Creates the piece component.
 * @param {Props} props the props of the component
 * @returns an object the describes the rendering of the component
 */
export function Piece({piece}) {
    const pathRef = useRef()
    const dispatch = useDispatch()

    /**
     * Implements the ability to drag pieces around the canvas
     */
    useEffect(() => {    
        
        const handleDrag = d3.drag()
            .on('drag', function(event) {
                //dispatch(deselectAllPieces())
                //dispatch(selectPiece([piece.id]))

                
                if(piece.selected) {
                    updatePiecePosition(
                        dispatch, piece,
                        {x: event.x, y: event.y}
                    )
                }
            });
        handleDrag(d3.select(pathRef.current));
    }, [piece])

    /**
     * createPiecePath() 
     * @description creates the path for the piece
     * @returns the path of the piece
     */
    function createPiecePath() {
        let path = d3.path();

        if(piece.sides.length >= 3) {
            for (let index = 0; index < piece.sides.length; index++) {
                const side = piece.sides[index];

                if(index === 0) {
                    path.moveTo(side.constraints.startPoint.value.x, side.constraints.startPoint.value.y);
                }

                switch(side.type) {
                    case "line": 
                        createPathForLineSide(path, side.constraints);
                        break;
                    case "arc":
                        createPathForArcSide(path, side.constraints, {x: side.x, y: side.y})
                        break;
                    case "arcTo":
                        //createPathForArcToSide(path, side.constraints, startPoint, endPoint)
                        break;
                    default:
                        break;
                }
            }

            path.closePath()
        }

        return path;  
    }

    /**
     * onClick()
     * @description selects the piece on click
     */
    function onClick() {
        console.log("Piece Clicked");
        dispatch(deselectAllPieces())
        dispatch(selectPiecesAction([piece.id]))
        dispatch(setSelectedPieceId(piece.id))
    }


    console.log("Piece");


    return (
        <path 
            ref={pathRef} d={createPiecePath().toString()}
            onClick={onClick}
            transform={"rotate(" + 
                piece.constraints.rotation.value + ", " + 
                piece.constraints.position.value.x + ", " + 
                piece.constraints.position.value.y + ")"
            }
            fill="red" stroke={(piece.selected) ? "green" : "blue"} strokeWidth="2" />
    )
}