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
 * getPiecesWithinRect()
 * @param {Array[Piece]} pieces all the pieces currently on the canvas
 * @param {x, y, width, height} rect the selection box
 */
export function getPiecesWithinRect(pieces, rect) {
    let ids = [];
    for(const piece of Object.values(pieces)) {

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



/**
 * getDisplayName()
 * @description gets the display name for the constraint
 * @param name the name the of the constraint
 */
export function getDisplayName(name) {
    return {
        tabWidth: "Tab Width", 
        tabLength: "Tab Length",
        length: "Length",
        radius: "Radius",
        subdivisions: "Subdivisions",
        startPoint: "Start Point",
        endPoint: "End Point",
        startIn: "Start In",
    }[name]
}






