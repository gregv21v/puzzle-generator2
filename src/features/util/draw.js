/**
 * This file contains the function for drawing the pieces
 */

import Line from "./Line";

/**
 * createPathForLineSide()    
 * @description creates the Path for a side of the piece
 * @param {Object} constraints an object containing the constraints of the side 
 * @param {Point} startPoint the start point of the side 
 * @param {Point} endPoint the end point of the side
 * @returns an array of Path
 */
 export function createPathForLineSide(path, constraints) {

    let deltaX = (constraints.endPoint.value.x - constraints.startPoint.value.x) / constraints.subdivisions.value
    let deltaY = (constraints.endPoint.value.y - constraints.startPoint.value.y) / constraints.subdivisions.value
    let line = new Line(constraints.startPoint.value, constraints.endPoint.value)
    let perpendicularVector = line.getPerpendicularVector();
    
    for(let j = 0; j < constraints.subdivisions.value+1; j++) {

        let D1 = {
            x: (constraints.startPoint.value.x + deltaX * (j-1)) + constraints.tabLength.value * perpendicularVector.x,
            y: (constraints.startPoint.value.y + deltaY * (j-1)) + constraints.tabLength.value * perpendicularVector.y
        }

        let D2 = {
            x: (constraints.startPoint.value.x + deltaX * j) + constraints.tabLength * perpendicularVector.x,
            y: (constraints.startPoint.value.y + deltaY * j) + constraints.tabLength * perpendicularVector.y
        }

        if(constraints.startIn) { // output: _-_
            if(j % 2 === 0 && j > 0) {
                // outward tab 
                path.lineTo(D1.x, D1.y)//points.push(D1) // line outward perpendicular to the start point 
                path.lineTo(D2.x, D2.y)//points.push(D2) // line across
                path.lineTo(constraints.startPoint.value.x + deltaX * j, constraints.startPoint.value.y + deltaY * j)
                /*points.push({
                    x: constraints.startPoint.value.x + deltaX * j,
                    y: constraints.startPoint.value.y + deltaY * j
                })*/ // line back to the original line
            } else { // inward tab
                path.lineTo(constraints.startPoint.value.x + deltaX * j, constraints.startPoint.value.y + deltaY * j)
                /*points.push({
                    x: constraints.startPoint.value.x + deltaX * j,
                    y: constraints.startPoint.value.y + deltaY * j
                })*/
            }
        } else { // output: -_-
            if(j % 2 === 1) {
                path.lineTo(D1.x, D1.y)//points.push(D1) // line outward perpendicular to the start point 
                path.lineTo(D2.x, D2.y)//points.push(D2) // line across
                path.lineTo(constraints.startPoint.value.x + deltaX * j, constraints.startPoint.value.y + deltaY * j)
                /*points.push({
                    x: constraints.startPoint.value.x + deltaX * j,
                    y: constraints.startPoint.value.y + deltaY * j
                }) */// line back to the original line
            } else {
                path.lineTo(constraints.startPoint.value.x + deltaX * j, constraints.startPoint.value.y + deltaY * j)
                /*points.push({
                    x: constraints.startPoint.value.x + deltaX * j,
                    y: constraints.startPoint.value.y + deltaY * j
                })*/
            }
        }

        
        
    }
    path.lineTo(constraints.endPoint.value.x, constraints.endPoint.value.y);

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