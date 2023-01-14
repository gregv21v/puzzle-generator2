import { useRef } from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { addPiece, moveVertex, setConstraintValue } from "../pieces/piecesSlice";
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
export function Vertex({piece, vertex}) {
    const circleRef = useRef(null);
    const dispatch = useDispatch();
    const tool = useSelector(selectTool)
    const axisLock = useSelector(selectAxisLock)
    const vertexSize = 10

    let globalVertex = getGlobalCoordinate(piece, vertex.constraints.startPoint.value)
    //let previousVertex = getGlobalCoordinate(piece, piece.sides[parseInt(vertex.id)-1].constraints.startPoint.value)


    // allows you to move the vertex
    useEffect(() => {    
        const handleDrag = d3.drag()
            .on('drag', function(event) {
                let localVertex = getLocalCoordinate(piece, {x: event.x, y: event.y})

                if(piece.selected && tool === "Edit") {
                    let sideCount = Object.keys(piece.sides).length;
                    let prevId = (vertex.id - 1 < 0) ? sideCount-1 : vertex.id - 1;
                    let nextId = (vertex.id + 1) % sideCount;
                    let newPosition = {
                        x: (axisLock === "y") ? vertex.constraints.startPoint.value.x : localVertex.x,
                        y: (axisLock === "x") ? vertex.constraints.startPoint.value.y : localVertex.y
                    }

                    console.log(prevId, nextId);

                    // recalculate the length of the sides

                    // recalculate the length at the previous vertex
                    dispatch(setConstraintValue({
                        path: [piece.id, "sides", prevId, "length"],
                        newValue: dist(
                            piece.sides[prevId].constraints.startPoint.value,
                            newPosition
                        )
                    }))

                    // recalculate the length at the current vertex
                    dispatch(setConstraintValue({
                        path: [piece.id, "sides", vertex.id, "length"],
                        newValue: dist(
                            newPosition,
                            piece.sides[nextId].constraints.startPoint.value
                        )
                    }))


                    // move the vertex
                    dispatch(moveVertex({
                        pieceId: piece.id,
                        vertexId: vertex.id,
                        ...newPosition
                    }))
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