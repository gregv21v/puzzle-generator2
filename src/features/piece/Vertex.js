import { useRef } from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { moveVertex } from "../pieces/piecesSlice";
import { getGlobalCoordinate, getLocalCoordinate } from "../util/draw"
import * as d3 from "d3"
import { selectTool } from "../tool/toolSlice";


/**
 * Vertex()
 * @description the vertex component
 * @param {Piece} piece the piece that this vertex is a part of
 * @param {Vertex} vertex the vertex
 */
export function Vertex({piece, vertex}) {
    const circleRef = useRef(null);
    const dispatch = useDispatch();
    const tool = useSelector(selectTool)
    const vertexSize = 10

    let globalVertex = getGlobalCoordinate(piece, vertex.constraints.startPoint.value)
    //let previousVertex = getGlobalCoordinate(piece, piece.sides[parseInt(vertex.id)-1].constraints.startPoint.value)


    // allows you to move the vertex
    useEffect(() => {    
        const handleDrag = d3.drag()
            .on('drag', function(event) {
                let localVertex = getLocalCoordinate(piece, {x: event.x, y: event.y})
                if(piece.selected && tool === "Edit") {
                    dispatch(moveVertex({
                        pieceId: piece.id,
                        vertexId: vertex.id,
                        x: localVertex.x,
                        y: localVertex.y
                    }))
                }
            });
        handleDrag(d3.select(circleRef.current));
    }, [piece, vertex, dispatch, circleRef])

    return (
        <rect 
            ref={circleRef}
            key={vertex.id} 
            width={vertexSize} 
            height={vertexSize}
            strokeWidth="2"
            x={globalVertex.x - vertexSize/2}
            y={globalVertex.y - vertexSize/2}
            stroke="green"
            fill="white"
        >
        </rect>
    )
}