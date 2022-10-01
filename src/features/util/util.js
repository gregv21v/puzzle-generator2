import Line from "./Line"


/**
 * dist()
 * @description finds the distance between a start and end point
 * @param {Point} start the starting point
 * @param {Point} end the ending point
 */
export function dist(start, end) {
    return Math.sqrt(
        Math.pow(start.x - end.x, 2) + 
        Math.pow(start.y - end.y, 2)
    )
}

/**
 * pointWithinRect()
 * @description checks to see if a given point is within a given rectangle
 * @param {x, y} point the point to check for
 * @param {x, y, width, height} rect the rectangle to check in
 */
export function pointWithinRect(point, rect) {
    return (rect.x <= point.x && point.x <= rect.x + rect.width) &&
        (rect.y <= point.y && point.y <= rect.y + rect.height)
}

/**
 * rectWithinRect()
 * @description checks to see if one rect is within another
 * @param {x, y, width, height} rect1 the rect that is suppose to be in rect 1 
 * @param {x, y, width, height} rect2 the surrounding rect
 */
export function rectWithinRect(rect1, rect2) {
    return (
        pointWithinRect({x: rect1.x, y: rect1.y}, rect2) && 
        pointWithinRect({x: rect1.x + rect1.width, y: rect1.y}, rect2) &&
        pointWithinRect({x: rect1.x, y: rect1.y + rect1.height}, rect2) &&
        pointWithinRect({x: rect1.x + rect1.width, y: rect1.y + rect1.height}, rect2)
    )
}

/**
 * createPointsForSide()    
 * @description creates the points for a side of the piece
 * @param {Object} constraints an object containing the constraints of the side 
 * @param {Point} startPoint the start point of the side 
 * @param {Point} endPoint the end point of the side
 * @returns an array of points
 */
 export function createPointsForSide(constraints, startPoint, endPoint) {
    let points = [];
    points.push(startPoint)
    
    //console.log("Start Point: " + JSON.stringify(startPoint));
    //console.log("End Point: " + JSON.stringify(constraints.endPoint));

    let deltaX = (endPoint.x - startPoint.x) / constraints.subdivisions
    let deltaY = (endPoint.y - startPoint.y) / constraints.subdivisions
    let line = new Line(startPoint, endPoint)
    let perpendicularVector = line.getPerpendicularVector();
    
    for(let j = 0; j < constraints.subdivisions+1; j++) {

        let D1 = {
            x: (startPoint.x + deltaX * (j-1)) + constraints.tabLength * perpendicularVector.x,
            y: (startPoint.y + deltaY * (j-1)) + constraints.tabLength * perpendicularVector.y
        }

        let D2 = {
            x: (startPoint.x + deltaX * j) + constraints.tabLength * perpendicularVector.x,
            y: (startPoint.y + deltaY * j) + constraints.tabLength * perpendicularVector.y
        }

        if(constraints.startIn) { // output: _-_
            if(j % 2 === 0 && j > 0) {
                // outward tab 
                points.push(D1) // line outward perpendicular to the start point 
                points.push(D2) // line across
                points.push({
                    x: startPoint.x + deltaX * j,
                    y: startPoint.y + deltaY * j
                }) // line back to the original line
            } else { // inward tab
                points.push({
                    x: startPoint.x + deltaX * j,
                    y: startPoint.y + deltaY * j
                })
            }
        } else { // output: -_-
            if(j % 2 === 1) {
                points.push(D1) // line outward perpendicular to the start point 
                points.push(D2) // line across
                points.push({
                    x: startPoint.x + deltaX * j,
                    y: startPoint.y + deltaY * j
                }) // line back to the original line
            } else {
                points.push({
                    x: startPoint.x + deltaX * j,
                    y: startPoint.y + deltaY * j
                })
            }
        }


        
    }
    points.push(endPoint);

    return points;
}








/**
 * getPiecesWithinRect()
 * @param {Array[Piece]} pieces all the pieces currently on the canvas
 * @param {x, y, width, height} rect the selection box
 */
export function getPiecesWithinRect(pieces, rect) {
    let ids = [];
    for(const piece of pieces) {

        let radius = piece.constraints.radius;

        // if using side length
        if(piece.type === "sided" && piece.useSideLength) {
            let theta = 360 / piece.sides.length; // the angle to subdivide with
            radius = piece.constraints.sideLength / (2 * Math.tan((theta/2) * (Math.PI / 180)));
        }


        if(
            radius <= piece.x - rect.x && piece.x - rect.x <= rect.width - radius &&
            radius <= piece.y - rect.y && piece.y - rect.y <= rect.height - radius
        ) {
            ids.push(piece.id)
        }
    }

    //console.log(ids);
    return ids;
}






