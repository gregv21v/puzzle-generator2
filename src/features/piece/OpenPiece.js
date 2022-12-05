import * as d3 from "d3"
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { movePiece, selectPieceAction } from '../pieces/piecesSlice';
import { setSelectedPiecesId } from "../selectedPiecesId/selectedPiecesIdSlice";
import { createPathForArcSide, createPathForLineSide, getGlobalCoordinate } from "../util/draw";



/**
 * Piece
 * @description Creates the piece component.
 * @param {Props} props the props of the component
 * @returns an object the describes the rendering of the component
 */
export function OpenPiece({piece}) {
    const dispatch = useDispatch()

    /** 
     * createPieceSide() 
     * @description creates the side of the piece
     */
    function createPieceSide(path, piece, current, next) {
        if(current && next) {
            switch(current.constraints.type.value) {
                case "line": 
                    createPathForLineSide(path, piece, current.constraints, next.constraints.startPoint.value);
                    break;
                case "arc":
                    createPathForArcSide(path, piece, current.constraints, {x: current.x, y: current.y})
                    break;
                case "arcTo":
                    //createPathForArcToSide(path, side.constraints, startPoint, endPoint)
                    break;
                default:
                    break;
            }
        }
        
    }

    /**
     * createPiecePath() 
     * @description creates the path for the piece
     * @returns the path of the piece
     */
    function createPiecePath() {
        let path = d3.path();
        
        let current = null,
            next = null,
            first = null,
            i = 0;

        for (let side of Object.values(piece.sides)) {
            // first side 
            if(i === 0) {
                let start = getGlobalCoordinate(piece, side.constraints.startPoint.value)
                path.moveTo(start.x, start.y);
                next = side;
                first = side;
            // in the middle
            } else if(i > 0) {
                current = next;
                next = side;
            } 

            createPieceSide(path, piece, current, next);
            i++;
        }

        return path;  
    }

    // renders the piece
    return (
        <path 
            d={createPiecePath().toString()}
            transform={"rotate(" + 
                piece.constraints.rotation.value + ", " + 
                piece.constraints.center.value.x + ", " + 
                piece.constraints.center.value.y + ")"
            }
            fill={piece.constraints.color.value} 
            stroke={"green"} 
            strokeWidth={"2"} />
    )
}