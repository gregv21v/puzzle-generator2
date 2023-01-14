import { useRef } from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { addPiece, moveVertex, pieceSetVertex, setConstraintValue } from "../pieces/piecesSlice";
import { getGlobalCoordinate, getLocalCoordinate, recalculateLengths } from "../util/draw"
import * as d3 from "d3"
import { selectTool } from "../tool/toolSlice";
import { selectAxisLock } from "../axisLock/axisLockSlice";
import { dist } from "../util/util";


/**
 * Vertex()
 * @description the vertex component
 * @param {Piece} piece the piece that this vertex is a part of
 * @param {Vertex} vertex the vertex
 */
export function Vertex2({piece, vertex, index}) {
    const circleRef = useRef(null);
    const dispatch = useDispatch();
    const tool = useSelector(selectTool)
    const vertexSize = 10

    let globalVertex = getGlobalCoordinate(piece, vertex)

    // allows you to move the vertex
    useEffect(() => {    
        const handleDrag = d3.drag()
            .on('drag', function(event) {
                let localMousePoint = getLocalCoordinate(piece, {x: event.x, y: event.y})

                if(piece.selected && tool === "Edit") {
                    dispatch(pieceSetVertex({
                        pieceId: piece.id,
                        vertexId: index,
                        vertex: localMousePoint
                    }))

                    // recalculate the center of the piece
                    
                }
            });
        handleDrag(d3.select(circleRef.current));
    }, [piece, vertex, dispatch, circleRef])

    return (
        <g>
            <rect 
                ref={circleRef}
                width={vertexSize} 
                height={vertexSize}
                strokeWidth="2"
                x={globalVertex.x - vertexSize/2}
                y={globalVertex.y - vertexSize/2}
                stroke="green"
                fill="white"
            ></rect>
            <text
                visibility={"true"}
                x={globalVertex.x - vertexSize/2}
                y={globalVertex.y - vertexSize/2}
            >{vertex.id}</text>
        </g>     
    )
}