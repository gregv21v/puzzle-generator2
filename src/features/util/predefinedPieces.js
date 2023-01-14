/**
 * This contains a list of predefined pieces that you can use to create your puzzles
 */

import { getPointOnPolygon } from '../util/geometry';
import { dist } from '../util/util';
import _ from "lodash";
import { recalculateLengths } from './draw';

/**
 * generateShape() 
 * @description generates a shape that have vertices and edges instead of a list of sides
 * @param {string} id the id of the shape 
 * @param {number} x the center x coordinate of the piece
 * @param {number} y the center y coordinate of the piece
 * @param {boolean} selected whether this shape is selected or not
 */
export function generateShape2Piece(id, x=100, y=100, selected = true) {
    return {
      id, 
      name: "piece2 " + id,
      selected,
      constraints: {
        type: {type: "option", optionType: "shape", value: "shape2", enabled: false, computed: true},
        center: {type: "point", value: {x, y}, enabled: true, computed: true},
        rotation: {type: "float", value: 45, enabled: true, computed: false},
        fill: {type: "color", value: "red", enabled: true, computed: false},
        stroke: {type: "color", value: "blue", enabled: true, computed: false},
      },
      vertices: [
        {x: 0, y: 0},
        {x: 100, y: 0},
        {x: 250, y: 55}
      ],
      edges: [
        generateEdge(0, 0, 1),
        generateEdge(0, 1, 2),
        generateEdge(0, 2, 0)
      ]
    }
}
  
/**
 * generateEdge()
 * @description generates a new edge
 * @param {string} id the id of the edge
 * @param {number} startVertexId the id of the start vertex that makes up the edge
 * @param {number} endVertexId the id of the end vertex that makes up the edge
 */
export function generateEdge(id, startVertexId, endVertexId) {
  return {
    id,
    constraints: {
      type: {type: "string", value: "line", enabled: true, computed: true},
      start: {type: "integer", value: startVertexId, enabled: true, computed: true},
      end: {type: "integer", value: endVertexId, enabled: true, computed: true},
      subdivisions: {type: "integer", value: 3, enabled: true, computed: true},
      length: {type: "float", value: 10, enabled: true, computed: false},
      tabWidth: {type: "float", value: 20, enabled: true, computed: false},
      tabLength: {type: "float", value: 10, enabled: true, computed: false},
      startIn: {type: "boolean", value: false, enabled: true, computed: false}  
    }
  }
}
  
  
/**
 * generateLineSide()
 * @descripition generates a side of type line
 * @param {integer} id the id of the generated side
 * @param {point} start the start point of the generated side
 * @param {point} end the end point of the generated side
 * @param {float} length the length of the generated side
 * @returns a new side object
 */
export function generateLineSide(id, start={x: 0, y: 0}, length=20) {
  return {
    id, constraints: _.merge(
      generateSideConstraints(),
      {
        startPoint: {value: start},
        length: {value: length}
      }
    )
  }
}
  
  
  
/**
 * generateSideConstraints()
 * @descripition generates the side constraints
 * @returns a list of side constraints
 */
export function generateSideConstraints() {
  return {
    type: {type: "string", value: "line", enabled: true, computed: true},
    startPoint: {type: "point", value: {x: 0, y: 0}, enabled: true, computed: true},
    //startVertexId: {type: "integer", value: 0, enabled: true, computed: false},
    //endVertexId: {type: "integer", value: 0, enabled: true, computed: false},
    subdivisions: {type: "integer", value: 3, enabled: true, computed: true},
    length: {type: "float", value: 10, enabled: true, computed: false},
    tabWidth: {type: "float", value: 20, enabled: true, computed: false},
    tabLength: {type: "float", value: 10, enabled: true, computed: false},
    startIn: {type: "boolean", value: false, enabled: true, computed: false}  
  }
}
  
  
/**
 * 
 * @param {integer} id the id of the side
 * @param {object} constraintValues the values of the constraints
 * example: {
 *    type: {value: "line"},
      startPoint: {value: start},
      endPoint: {value: end},
      subdivisions: {value: 3},
  * }
  * @returns a side with the given constraint values
  */
export function generateSide(id, constraintValues) {
  return {
    id, constraints: _.merge(generateSideConstraints(), constraintValues)
  }
}
  
/**
 * generateSidedPiece()
 * @description generates a sided piece given either a radius or side length
 * @param {integer} id the id of the new piece
 * @param {string} constraintName the name of the constraint to generate the piece with
 * @param {number} value the value of the constraint to generate the piece with
 * @param {number} sideCount the number of sides the piece starts out with
 * @param {number} x the x coordinate of the piece
 * @param {number} y the y coordinate of the piece
 * @param {boolean} selected whether the piece is selected or not
 * @returns a new sided piece
 */
export function generateSidedPiece(id, constraintName="radius", value=40, sideCount=3, x=50, y=50, selected = true) {
  let newPiece = {
    id, 
    name: "Regular Polygon " + id,
    selected,
    constraints: {
      type: {type: "option", optionType: "shape", value: "sided", enabled: false, computed: true},
      center: {type: "point", value: {x, y}, enabled: true, computed: true},
      rotation: {type: "float", value: 45, enabled: true, computed: false},
      radius: {type: "float", value: 50, enabled: true, computed: false},
      sideLength: {type: "float", value: 50, enabled: true, computed: false},
      tabLength: {type: "float", value: 50, enabled: true, computed: false},
      fill: {type: "color", value: "#0000FF", enabled: true, computed: false},
      stroke: {type: "color", value: "#0000FF", enabled: true, computed: false}
    },
    sides: {},
    order: []
  }


  let theta = 360 / sideCount
  if(constraintName === "radius") {
    // update the polygon according to its radius
    newPiece.constraints.sideLength.computed = true 
    newPiece.constraints.radius.value = value
    newPiece.constraints.sideLength.value = dist(
        getPointOnPolygon(value, 0),
        getPointOnPolygon(value, theta)
    )

  } else if(constraintName === "sideLength") {
    // update the polygon according to its side length
    newPiece.constraints.radius.computed = true;
    newPiece.constraints.sideLength.value = value
    newPiece.constraints.radius.value = newPiece.constraints.sideLength.value / (2 * Math.tan((theta/2) * (Math.PI / 180)))
    
  }

  for (let index = 0; index < sideCount; index++) {
    let angle1 = (index) * theta

    // add the new side to the polygon
    newPiece.sides[index] = generateLineSide(
      index, 
      { // start point
        x: newPiece.constraints.radius.value * Math.sin(angle1 * (Math.PI / 180)),
        y: newPiece.constraints.radius.value * Math.cos(angle1 * (Math.PI / 180))
      },
      newPiece.constraints.sideLength.value
    );

    newPiece.order.push(index)
  }

  return newPiece;
}
  
/**
 * generateRectangularPiece()
 * @description generates a rectangle piece
 * @param {integer} id the id of the piece
 * @param {number} width the width of the rectangle
 * @param {number} height the height of the rectangle
 * @param {number} x the x coordinate of the rectangle
 * @param {number} y the y coordinate of the rectangle
 * @param {boolean} selected whether the rectangle is selected
 * @returns 
 */
export function generateRectangularPiece(id, width=150, height=150, x=150, y=150, selected=true) {
  let rect = {
    id, 
    name: "rectangle " + id,
    selected,
    constraints: {
      type: {type: "option", optionType: "shape", value: "rectangle", enabled: false, computed: true},
      center: {type: "point", value: {x, y}, enabled: true, computed: true},
      rotation: {type: "float", value: 0, enabled: true, computed: false},
      width: {type: "float", value: width, enabled: true, computed: false},
      height: {type: "float", value: height, enabled: true, computed: false},
      tabLength: {type: "float", value: 50, enabled: true, computed: false},
      fill: {type: "color", value: "#0000FF", enabled: true, computed: false},
      stroke: {type: "color", value: "#0000FF", enabled: true, computed: false}
    },
    sides: {},
    order: [0, 1, 2, 3] // the order in which the vertices appear
  }

  // Create the sides for the polygon

  // top side
  rect.sides[0] = generateLineSide(
    0,
    {x: width/2, y: -height/2},
    width
  )

  // right side
  rect.sides[1] = generateLineSide(
    1,
    {x: -width/2, y: -height/2},
    height
  )

  // bottom side
  rect.sides[2] = generateLineSide(
    2,
    {x: -width/2, y: height/2},
    width
  )

  // left side
  rect.sides[3] = generateLineSide(
    3,
    {x: width/2, y: height/2},
    height
  )

  return recalculateLengths(rect);
  
}

/**
 * generateFreePiece()
 * @description generates a free draw piece
 * @param {integer} id the id of the free piece
 * @param {boolean} selected whether the piece is selected or not
 * @returns a free draw piece
 */
export function generateFreePiece(id, selected=true) {
  return {
    id, 
    selected,
    name: "Free " + id,
    constraints: {
      type: {type: "string", value: "free", computed: true, enabled: false},
      center: {type: "point", value: {x: 0, y: 0}, enabled: true, computed: true},
      rotation: {type: "float", value: 0, enabled: true, computed: false},
      fill: {type: "color", value: "#0000FF", enabled: true, computed: false},
      stroke: {type: "color", value: "black", enabled: true, computed: false}
    },
    sides: {}, 
    order: []
  }
} 

/**
 * generateCirclePiece()
 * @description generates a circle piece
 * @param {integer} id the id of the circle piece
 * @param {float} x the x coordinate of the piece
 * @param {float} y the y coordinate of the piece
 * @param {float} radius the radius of the circle piece
 * @returns 
 */
export function generateCirclePiece(id, x=100, y=100, radius=50) {
  return {
    id,
    name: "circle" + id,
    constraints: {
      type: {type: "option", optionType: "shape", value: "circle", enabled: false, computed: true},
      center: {type: "point", value: {x, y}, enabled: true, computed: true},
      radius: {type: "float", value: radius, enabled: true, computed: false},
      tabLength: {type: "float", value: 50, enabled: true, computed: false},
      subdivisions: {type: "integer", value: 10, enabled: true, computed: false},
      fill: {type: "color", value: "#0000FF", enabled: true, computed: false},
      stroke: {type: "color", value: "#FFFFFF", enabled: true, computed: false}
    }
  }
}


