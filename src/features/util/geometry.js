import { dist } from "./util";

/**
 * getPointOnPolygon()
 * @description gets a point on a polygon with all equal sides
 * @param {point} centerPoint the center point of the polygon
 * @param {number} radius the radius of the polygon
 * @param {number} angle the angle on the polygon
 */
export function getPointOnPolygon(radius, angle) {
    return {
        x: radius * Math.sin(angle * (Math.PI / 180)),
        y: radius * Math.cos(angle * (Math.PI / 180))
    }
}



/**
 * getPolygonSidePoints() 
 * @description gets the side points of a regular polygon
 * @param {point} position the position of the regular polygon
 * @param {number} index the index of the side of the polygon
 * @param {number} sideCount the number of sides on the polygon
 * @param {number} radius the radius of the polygon
 */
export function getPolygonSidePoints(index, sideCount, radius) {
    let theta = 360 / sideCount;
    return {
        startPoint: {value: getPointOnPolygon(radius, index * theta)},
        endPoint: {value: getPointOnPolygon(radius, (index+1) * theta)},
    }
}


/**
 * getPolygonSideLength()
 * @description gets the side length of each side of a regular polygon
 * @param {number} sideCount the number of sides on the regular polygon
 * @param {number} radius the radius of the regular polygon
 */
export function getPolygonSideLength(sideCount, radius) {
    return dist(
        getPointOnPolygon(radius, 0),
        getPointOnPolygon(radius, 360 / sideCount)
    )
}


/**
 * getPolygonRadius()
 * @description gets the radius of a polygon given its side length
 * @param {number} sideCount the number of sides on the regular polygon
 * @param {number} sideLength the sideLength of the regular polygon
 */
export function getPolygonRadius(sideCount, sideLength) {
    let theta = 360 / sideCount;
    return sideLength / (2 * Math.tan((theta/2) * (Math.PI / 180)))
}



/**
 * getPolygon()
 * @description gets a polygon given certain parameters
 * @param {number} sideCount the number of sides on the polygon
 * @param {string} constraintName the name of the constraint to use to determine how the polygon is generated
 * @param {number} value the value of the constraint
 * @returns a polygon
 */
export function getPolygon(sideCount, constraintName, value) {
    // create a new polygon object
    let polygon = {
        radius: {value: 0},
        sideLength: {value: 0},
        sides: {}
    }

    // set the radius and side length
    if(constraintName === "radius") {
        polygon.radius.value = value
        polygon.sideLength.value = getPolygonSideLength(sideCount, value)
    } else if(constraintName === "sideLength") {
        // update 
        polygon.sideLength.value = value
        polygon.radius.value = getPolygonRadius(sideCount, value)
    }

    // set the side constraints
    for (let index = 0; index < sideCount; index++) {
        let side = getPolygonSidePoints(index, sideCount, polygon.radius.value)
        side.length = {value: polygon.sideLength.value}
        polygon.sides[Object.keys(polygon.sides).length] = side;
    }


    return polygon;    
}


