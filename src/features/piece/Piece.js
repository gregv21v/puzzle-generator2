import * as d3 from "d3"
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { deselectAllPieces, movePiece, selectPiecesAction } from '../pieces/piecesSlice';
import { setSelectedPieceId } from "../selectedPieceId/selectedPieceIdSlice";
import { createPointsForSide } from "../util/util";



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
                dispatch(movePiece({
                    pieceId: piece.id,
                    x: event.x,
                    y: event.y
                }))
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
            let radius = piece.constraints.radius
            if(piece.useSideLength) { // if using side length
                let theta = 360 / piece.sides.length // the angle to subdivide with
                radius = piece.constraints.sideLength / (2 * Math.tan((theta/2) * (Math.PI / 180)))
            } 


            let allPoints = []
            for (let index = 0; index < piece.sides.length; index++) {
                const side = piece.sides[index];
                let angle1 = (index) * (360 / piece.sides.length)
                let angle2 = (index+1) * (360 / piece.sides.length)

                let startPoint = {
                    x: piece.x + radius * Math.sin(angle1 * (Math.PI / 180)),
                    y: piece.y + radius * Math.cos(angle1 * (Math.PI / 180))
                }
                
                let endPoint = {
                    x: piece.x + radius * Math.sin(angle2 * (Math.PI / 180)),
                    y: piece.y + radius * Math.cos(angle2 * (Math.PI / 180))
                }

                allPoints = allPoints.concat(createPointsForSide(side.constraints, startPoint, endPoint))
            }

            //console.log(allPoints);
            
            path.moveTo(allPoints[0].x, allPoints[0].y)
            for(const point of allPoints) {
                path.lineTo(point.x, point.y)
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




    return (
        <path 
            ref={pathRef} d={createPiecePath().toString()}
            onClick={onClick}
            transform={"rotate(" + piece.constraints.rotation + ", " + piece.x + ", " + piece.y + ")"}
            fill="red" stroke={(piece.selected) ? "green" : "blue"} strokeWidth="2" />
    )
}