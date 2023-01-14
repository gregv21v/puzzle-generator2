/**
 * This file contains the function for drawing the pieces
 */

import Line from "./Line";
import { dist } from "./util";




/**
 * recalculateCenter() 
 * @description recalculates the center of a piece
 * @param {Piece} piece the piece to recalculate the center for 
 * @returns the piece with its new center 
 */
export function recalculateCenter(piece) {
    let newPiece = {...piece}

    // add up the x and y coordinates of each side
    let totals = {x: 0, y: 0}
    for (const side of Object.values(newPiece.sides)) {
        totals.x += side.constraints.startPoint.value.x;
        totals.y += side.constraints.startPoint.value.y;
    }

    // set the new center 
    newPiece.constraints.center.value = {
        x: totals.x / Object.keys(newPiece.sides).length,
        y: totals.y / Object.keys(newPiece.sides).length
    } 

    // recalculate the position of each side
    for (const key of Object.keys(newPiece.sides)) {
        newPiece.sides[key].constraints.startPoint.value.x -= newPiece.constraints.center.value.x
        newPiece.sides[key].constraints.startPoint.value.y -= newPiece.constraints.center.value.y
    }

    return newPiece;
}

/**
 * recalculateLengths()
 * @description recalculates the lengths of the sides on the pieces
 * @param {Piece} piece the piece to recalculate the lengths for 
 * @returns the new piece with the recalculated lengths
 */
export function recalculateLengths(piece) {
    
    // calculate lengths
    let sides = {}
    for (let index = 0; index < piece.order.length; index++) {
        let current = piece.sides[index];
        let next = piece.sides[(index + 1) % piece.order.length]
        
        sides[index] = {
            ...current,
            constraints: {
                ...current.constraints,
                length: {
                    ...current.constraints.length,
                    value: dist(
                        current.constraints.startPoint.value,
                        next.constraints.startPoint.value
                    ) 
                }
            }
        }
    }

    return {
        ...piece,
        sides
    };
}

/**
 * adapted from: https://9to5answer.com/rotate-rectangle-around-a-point
 * rotatePoint()
 * @description rotates a point around another point
 * @param {Point} center the point to rotate around
 * @param {Point} point the point to rotate 
 * @param {Number} angle the angle in degress to rotate the point by
 * @returns the rotated point
 */
export function rotatePoint(center, point, angle) {
    let angleInRadians = angle * (Math.PI / 180)
    return {
        x: Math.cos(angleInRadians) * (point.x-center.x) - Math.sin(angleInRadians) * (point.y-center.y) + center.x,
        y: Math.sin(angleInRadians) * (point.x-center.x) + Math.cos(angleInRadians) * (point.y-center.y) + center.y
    };
}


/**
 * getGlobalCoordinate()
 * @description get the global position of a given point on a piece
 * @param {Piece} piece the piece that the point is on
 * @param {Point} point the point to get the global coordinate of 
 */
export function getGlobalCoordinate(piece, point) {
    return {
        x: piece.constraints.center.value.x + point.x,
        y: piece.constraints.center.value.y + point.y
    }
}


/**
 * getLocalCoordinate()
 * @description get the local position of a given point on a piece
 * @param {Piece} piece the piece that the point is on
 * @param {Point} point the point to get the local coordinate of 
 */
export function getLocalCoordinate(piece, point) {
    return {
        x: point.x - piece.constraints.center.value.x,
        y: point.y - piece.constraints.center.value.y
    }
}



/**
 * @deprecated
 * createPathForLineSide()    
 * @description creates the Path for a side of the piece
 * @param {Object} constraints an object containing the constraints of the side 
 * @param {Point} startPoint the start point of the side 
 * @param {Point} endPoint the end point of the side
 * @returns an array of Path
 */
export function createPathForLineSide(path, piece, constraints, endPoint) {

    let start = getGlobalCoordinate(piece, constraints.startPoint.value)
    let end = getGlobalCoordinate(piece, endPoint)

    let deltaX = (end.x - start.x) / constraints.subdivisions.value
    let deltaY = (end.y - start.y) / constraints.subdivisions.value
    let line = new Line(start, end)
    let perpendicularVector = line.getPerpendicularVector();
    
    for(let j = 0; j < constraints.subdivisions.value+1; j++) {

        let D1 = {
            x: (start.x + deltaX * (j-1)) + constraints.tabLength.value * perpendicularVector.x,
            y: (start.y + deltaY * (j-1)) + constraints.tabLength.value * perpendicularVector.y
        }

        let D2 = {
            x: (start.x + deltaX * j) + constraints.tabLength.value * perpendicularVector.x,
            y: (start.y + deltaY * j) + constraints.tabLength.value * perpendicularVector.y
        }

        if(constraints.startIn.value) { // output: _-_
            if(j % 2 === 0 && j > 0) {
                // outward tab 
                path.lineTo(D1.x, D1.y)//points.push(D1) // line outward perpendicular to the start point 
                path.lineTo(D2.x, D2.y)//points.push(D2) // line across
                path.lineTo(start.x + deltaX * j, start.y + deltaY * j)
                /*points.push({
                    x: start.x + deltaX * j,
                    y: start.y + deltaY * j
                })*/ // line back to the original line
            } else { // inward tab
                path.lineTo(start.x + deltaX * j, start.y + deltaY * j)
                /*points.push({
                    x: start.x + deltaX * j,
                    y: start.y + deltaY * j
                })*/
            }
        } else { // output: -_-
            if(j % 2 === 1) {
                path.lineTo(D1.x, D1.y)//points.push(D1) // line outward perpendicular to the start point 
                path.lineTo(D2.x, D2.y)//points.push(D2) // line across
                path.lineTo(start.x + deltaX * j, start.y + deltaY * j)
                /*points.push({
                    x: start.x + deltaX * j,
                    y: start.y + deltaY * j
                }) */// line back to the original line
            } else {
                path.lineTo(start.x + deltaX * j, start.y + deltaY * j)
                /*points.push({
                    x: start.x + deltaX * j,
                    y: start.y + deltaY * j
                })*/
            }
        }

        
        
    }
    path.lineTo(end.x, end.y);

    return path;
}


/**
 * createPathForLineEdge()    
 * @description creates the Path for an edge of the piece
 * @param {Edge} edge the edge to draw
 */
 export function createPathForLineEdge(path, piece, edge) {

    let start = getGlobalCoordinate(piece, piece.vertices[edge.constraints.start.value])
    let end = getGlobalCoordinate(piece, piece.vertices[edge.constraints.end.value])

    let deltaX = (end.x - start.x) / edge.constraints.subdivisions.value
    let deltaY = (end.y - start.y) / edge.constraints.subdivisions.value
    let line = new Line(start, end)
    let perpendicularVector = line.getPerpendicularVector();
    
    for(let j = 0; j < edge.constraints.subdivisions.value+1; j++) {

        let D1 = {
            x: (start.x + deltaX * (j-1)) + edge.constraints.tabLength.value * perpendicularVector.x,
            y: (start.y + deltaY * (j-1)) + edge.constraints.tabLength.value * perpendicularVector.y
        }

        let D2 = {
            x: (start.x + deltaX * j) + edge.constraints.tabLength.value * perpendicularVector.x,
            y: (start.y + deltaY * j) + edge.constraints.tabLength.value * perpendicularVector.y
        }

        if(edge.constraints.startIn.value) { // output: _-_
            if(j % 2 === 0 && j > 0) {
                // outward tab 
                path.lineTo(D1.x, D1.y) // line outward perpendicular to the start point 
                path.lineTo(D2.x, D2.y) // line across
                path.lineTo(start.x + deltaX * j, start.y + deltaY * j)
            } else { // inward tab
                path.lineTo(start.x + deltaX * j, start.y + deltaY * j)
            }
        } else { // output: -_-
            if(j % 2 === 1) {
                path.lineTo(D1.x, D1.y) // line outward perpendicular to the start point 
                path.lineTo(D2.x, D2.y) // line across
                path.lineTo(start.x + deltaX * j, start.y + deltaY * j)
            } else {
                path.lineTo(start.x + deltaX * j, start.y + deltaY * j)
            }
        }

        
        
    }
    path.lineTo(end.x, end.y);

    return path;
}

/**
 * createPointsForArcSide()    
 * @description creates the points for a side of the piece
 * @param {Object} constraints an object containing the constraints of the side 
 * @param {Point} point the control point of the arc
 * @param {Radians} startAngle the start angle in radians
 * @param {Radians} endAngle the end angle in radians
 * @returns an array of points
 */
export function createPathForArcSide(path, constraints, point) {

    path.moveTo(
        point.x + (constraints.radius) * Math.cos(constraints.startAngle),
        point.y + (constraints.radius) * Math.sin(constraints.startAngle)
    )
    
    let angle = (constraints.endAngle - constraints.startAngle) / constraints.subdivisions
    let offset = 0;
    
    for(let i = 0; i < constraints.subdivisions; i++) {
        
        path.arc(point.x, point.y, constraints.radius, angle * (i+offset), angle * (i+offset+1))
        path.lineTo(
            point.x + (constraints.radius + constraints.tabLength) * Math.cos(angle * (i+offset+1)),
            point.y + (constraints.radius + constraints.tabLength) * Math.sin(angle * (i+offset+1))
        )
        path.arc(point.x, point.y, constraints.radius + constraints.tabLength, angle * (i+offset+1), angle * (i+offset+2))
        path.lineTo(
            point.x + (constraints.radius) * Math.cos(angle * (i+offset+2)),
            point.y + (constraints.radius) * Math.sin(angle * (i+offset+2))
        )

        offset += 1;
    }

    return path;
}


/**
 * createPointsForArcToSide()    
 * @description creates the points for an arced side of the piece
 * @param {Object} constraints an object containing the constraints of the side 
 * @param {Point} startPoint the starting point of the arc
 * @param {Point} endPoint the ending point of the arc
 * @returns an array of points
 */
export function createPathForArcToSide(path, constraints, startPoint, endPoint) {
    console.log(endPoint);
    
    let line = new Line(startPoint, endPoint);
    let perpendicularVector = line.getPerpendicularVector();
    path.quadraticCurveTo(
        (endPoint.x - startPoint.x) / 2 - perpendicularVector.x, 
        (endPoint.y - startPoint.y) / 2 - perpendicularVector.y,
        endPoint.x, endPoint.y
    );

    return path;
}