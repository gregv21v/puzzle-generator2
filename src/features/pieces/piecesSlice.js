import { createSlice, current } from '@reduxjs/toolkit';
import { getPointOnPolygon } from '../util/geometry';
import { dist } from '../util/util';
import _ from "lodash";

const initialState = {
  "0": generateSidedPiece("0"),
  //"1": generateCirclePiece("1"),
  "1": generateRectangularPiece("1")
};

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
 * @param {number} id the id of the new piece
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
      color: {type: "color", value: "#0000FF", enabled: true, computed: false}
    },
    sides: {}
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

    newPiece.sides[index] = generateLineSide(
      index, 
      { // start point
        x: newPiece.constraints.radius.value * Math.sin(angle1 * (Math.PI / 180)),
        y: newPiece.constraints.radius.value * Math.cos(angle1 * (Math.PI / 180))
      },
      newPiece.constraints.sideLength.value
    );
  }

  return newPiece;
}

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
      color: {type: "color", value: "#0000FF", enabled: true, computed: false}
    },
    sides: {}
  }

  // Create the sides for the polygon

  // top side
  rect.sides[0] = generateLineSide(
    0,
    {x: width/2, y: -height/2},
    height
  )

  // right side
  rect.sides[1] = generateLineSide(
    1,
    {x: -width/2, y: -height/2},
    width
  )

  // bottom side
  rect.sides[2] = generateLineSide(
    2,
    {x: -width/2, y: height/2},
    height
  )

  // left side
  rect.sides[3] = generateLineSide(
    3,
    {x: width/2, y: height/2},
    width
  )

  return rect;
  
}

/**
 * generateFreePiece()
 * @description generates a free draw piece
 * @param {integer} id the id of the free piece
 * @param {boolean} selected whether the piece is selected or not
 * @returns a free draw piece
 */
export function generateFreePiece(id, start={x: 0, y: 0}, selected=true) {
  return {
    id, 
    selected,
    color: "blue",
    constraints: {
      type: {type: "string", value: "free", computed: true, enabled: false},
      center: {type: "point", value: {x: 0, y: 0}, enabled: true, computed: true},
      rotation: {type: "float", value: 0, enabled: true, computed: false},
      color: {type: "color", value: "#0000FF", enabled: true, computed: false}
    },
    sides: {
      "0": generateLineSide(0, start)
    }
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
    color: "blue",
    constraints: {
      type: {type: "option", optionType: "shape", value: "circle", enabled: false, computed: true},
      center: {type: "point", value: {x, y}, enabled: true, computed: true},
      radius: {type: "float", value: radius, enabled: true, computed: false},
      tabLength: {type: "float", value: 50, enabled: true, computed: false},
      subdivisions: {type: "integer", value: 10, enabled: true, computed: false},
      color: {type: "color", value: "#0000FF", enabled: true, computed: false}
    }
  }
}


export const piecesSlice = createSlice({
  name: 'pieces',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    /**
     * loadPieces()
     * @description replaces all the pieces with new ones
     * @param {Object} pieces the new pieces
     */
    loadPieces: (state, action) => {
      return action.payload;
    },


    /**
     * selectAllPieces()
     * @description selects a list of piece
     */
    selectAllPieces: (state, action) => {
      let newPieces = {};
      for (const key of Object.keys(state)) {
        newPieces[key] = {
          ...state[key],
          selected: true
        }
      }
      return newPieces;
    },

    /**
     * deselectAllPieces()
     * @description deselects all the pieces
     */
    deselectAllPieces: (state) => {
      let newPieces = {};
      for (const key of Object.keys(state)) {
        newPieces[key] = {
          ...state[key],
          selected: false
        }
      }
      return newPieces;
    },

    /**
     * selectPiece
     * @description selects a list of piece
     * @param {Array[string]} pieceIds the ids of the pieces to select
     */
    selectPiecesAction: (state, action) => {
      for (const key of Object.keys(state)) {
        if(action.payload.includes(key)) {
          state[key].selected = true;
        } else {
          state[key].selected = false;
        }
      }
    },

    /**
     * selectPiece()
     * @param payload the id of the piece to select
     */
    selectPieceAction: (state, action) => {
      for (const key of Object.keys(state)) {
        if(key === "" + action.payload) {
          state[key].selected = true;
        } else {
          state[key].selected = false;
        }
      }
    },

    /**
     * deselectPiece()
     * @description deselects a list of pieces
     * @param pieceIds the ids of the pieces to deselect 
     */
    deselectPieces: (state, action) => {
      let newPieces = {};
      for (const key of Object.keys(state)) {
        newPieces[key] = {
          ...state[key],
          selected: !action.payload.includes(state[key].id)
        }
      }
      return newPieces;
    },

    /**
     * renamePiece() 
     * @description renames the piece
     * @param pieceId the id of the piece to rename
     * @param name the new name for the piece
     */
    renamePiece: (state, action) => {
      state[action.payload.pieceId].name = action.payload.name
    },
      

    /**
     * movePiece() 
     * @description changes the position of a piece 
     * @param pieceId the id of the piece to move 
     * @param x the change in x that took place as a result of dragging 
     * @param y the change in y that took place as a result of dragging
     */
    movePiece: (state, action) => {
      state[action.payload.pieceId].constraints.center.value = {
        x: action.payload.x,
        y: action.payload.y
      }
    },


    /**
     * moveCirclePiece()
     * @description moves the circle piece
     * 
     */
    moveCirclePiece: (state, action) => {
      state[action.payload.pieceId].constraints.center.value = {x: action.payload.x, y: action.payload.y};
    },


    /**
     * removeAllPieces()
     * @description removes all pieces
     */
    removeAllPieces: (state, action) => {
      return {}
    },

    /**
     * createPiece()
     * @description creates a new piece from scratch with the payload as the id
     */
    createPiece: (state, action) => {
      return {
        ...state, 
        [action.payload]: generateSidedPiece(action.payload)
      }
    },


    /**
     * createCirclePiece()
     * @description creates a new circle piece from scratch
     */
    createCirclePiece: (state, action) => {
      return {
        ...state, 
        [action.payload]: generateCirclePiece(action.payload)
      }
    },
   
    /**
     * addPiece() 
     * @description adds a piece to the list of pieces
     * @param payload the piece to add
     */
    addPiece: (state, action) => {
      return {
        ...state, 
        [action.payload.id]: {
          ...action.payload
        }
      }
    },

    /**
    * removePiece()
    * @description removes a piece from the list of pieces
    * @param payload the piece to remove
    */
    removePiece: (state, action) => { 
      let newPieces = {};
      for (const key of Object.keys(state)) {
        if(key != action.payload) {
          console.log(key + " not removed");
          newPieces[key] = {
            ...state[key]
          }
        }
      }
      return newPieces;
    },


    /**
     * setPieceRadius() 
     * @description sets the radius of the piece
     * @param pieceId the id of the piece to set the radius of 
     * @param radius the new radius to set the piece to 
     */
    setPieceRadius: (state, action) => {
      return {
        ...state,
        [action.payload]:{
          ...state[action.payload],
          radius: action.payload.radius
        }
      }
    },

    /**
    * setPieceConstraintValue() 
    * @description sets the constraints of a specific piece
    * @param pieceId the id of the piece to set the contraints of 
    * @param constraintId the id of the constraint
    * @param newValue the new value of the constraint
    */
    setPieceConstraintValue: (state, action) => {
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId], // copy the piece
          constraints: {
            ...state[action.payload.pieceId].constraints, // copy the constraints
            [action.payload.constraintId]: {
              ...state[action.payload.pieceId].constraints[action.payload.constraintId], // copy the constraint
              value: action.payload.newValue // update the value
            }
          }
        }
      }
    },

    /**
      * setConstraintValue() 
      * @description sets the constraints of a specific object
      * @param {Array} path the path to get to the object
      * @param {any} newValue the new value of the constraint
      */
    setConstraintValue: (state, action) => {
      let updatedTree = {};
      let root = updatedTree;
      for (let i = 0; i < action.payload.path.length - 1; i++) {
        let id = action.payload.path[i];
        root[id] = {}
        root = root[id];
      }

      let constraintName = action.payload.path[action.payload.path.length - 1]
      root.constraints = {
        [constraintName]: {
          value: action.payload.newValue
        }
      }

      return _.merge(state, updatedTree);
    },


    /**
      * toggleConstraintComputed() 
      * @description toggles the constraint computed value
      * @param {Array} path the path to get to the object
      */
    toggleConstraintComputed: (state, action) => {
      let updatedTree = {};
      let root = updatedTree;
      let oldValue = current(state);
      
      for (let i = 0; i < action.payload.path.length - 1; i++) {
        let id = action.payload.path[i];
        root[id] = {}
        root = root[id];
        oldValue = oldValue[id]
      }
      
      let constraintName = action.payload.path[action.payload.path.length - 1]

      root.constraints = {
        [constraintName]: {
          computed: !oldValue.constraints[constraintName].computed
        }
      }

      return _.merge(state, updatedTree);
    },

    /**
      * toggleConstraintEnabled() 
      * @description toggles the constraint computed value
      * @param {Array} path the path to get to the object
      */
    toggleConstraintEnabled: (state, action) => {
      let updatedTree = {};
      let root = updatedTree;
      let oldValue = current(state);
      
      for (let i = 0; i < action.payload.path.length - 1; i++) {
        let id = action.payload.path[i];
        root[id] = {}
        root = root[id];
        oldValue = oldValue[id]
      }
      
      let constraintName = action.payload.path[action.payload.path.length - 1]

      root.constraints = {
        [constraintName]: {
          enabled: !oldValue.constraints[constraintName].enabled
        }
      }

      return _.merge(state, updatedTree);
    },

    /**
      * toggleConstraintValue() 
      * @description toggles the constraint value
      * @param {Array} path the path to get to the object
      */
    toggleConstraintValue: (state, action) => {
      let updatedTree = {};
      let root = updatedTree;
      let oldValue = current(state);
      for (let i = 0; i < action.payload.path.length - 1; i++) {
        let id = action.payload.path[i];
        root[id] = {}
        root = root[id];
        oldValue = oldValue[id]
      }

      let constraintName = action.payload.path[action.payload.path.length - 1]

      console.log(oldValue);
      root.constraints = {
        [constraintName]: {
          value: !oldValue.constraints[constraintName].value
        }
      }

      return _.merge(state, updatedTree);
    },

    /**
     * pieces/togglePieceConstraintComputed
     * @description toggles whether the constraint is computed or not
     * @param pieceId the id of the piece to set the contraints of 
     * @param constraintId the name of the constraint
     */
    togglePieceConstraintComputed: (state, action) => {
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          constraints: {
            ...state[action.payload.pieceId].constraints,
            [action.payload.constraintId]: {
              ...state[action.payload.pieceId].constraints[action.payload.constraintId],
              computed: !state[action.payload.pieceId].constraints[action.payload.constraintId].computed
            }
          }
        }
      }
    },


    /**
     * sides/addSide
     * @description add a side to the list of sides of a given piece 
     * @param pieceId the id of the piece to add the side to 
     * @param side the side to add to the piece
     */
    addSide: (state, action) => {
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: {
            ...state[action.payload.pieceId].sides,
            [action.payload.side.id]: action.payload.side
          }
        }
      }
    },

    /**
     * sides/removeSide
     * @description remove a side from the given piece
     * @param pieceId the id of the piece to remove the side from 
     * @param sideId the id of the side to remove from the piece
     */
    removeSide: (state, action) => {
      let newSides = {...current(state)[action.payload.pieceId].sides}
      delete newSides[action.payload.sideId]

      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: newSides
        }
      }
    },
    /**
     * pieces/setSideConstraintsValue
     * @description sets the constraints of a side of a certain piece
     * @param pieceId the id of the piece to set the contraints of 
     * @param sideId the id of the piece to set the contraints on
     * @param constraintId the id of the contraint to set the value of 
     * @param newValue the new constraints value
     */
    setSideConstraintsValue: (state, action) => {
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: state[action.payload.pieceId].sides.map(side => {
            if(side.id === action.payload.sideId) {
                return {
                    ...side, 
                    constraints: {
                      ...side.constraints,
                      [action.payload.constraintId]: {
                        ...side.constraints[action.payload.constraintId],
                        value: action.payload.newValue
                      }
                    }
                }
            } else {
                return side;
            }
          })
        }
      }
    },

    /**
     * pieces/moveSideConstraintPoint
     * @description move the point on the side 
     * @param pieceId the id of the piece to set the contraints of 
     * @param sideId the id of the piece to set the contraints on
     * @param constraintId the id of the contraint to set the value of 
     * @param delta the new constraints value
     */
    moveSideConstraintPoint: (state, action) => {
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: state[action.payload.pieceId].sides.map(side => {
            if(side.id === action.payload.sideId) {
                return {
                    ...side, 
                    constraints: {
                      ...side.constraints,
                      [action.payload.constraintId]: {
                        ...side.constraints[action.payload.constraintId],
                        value: {
                          x: side.constraints[action.payload.constraintId].value.x + action.payload.delta.x,
                          y: side.constraints[action.payload.constraintId].value.y + action.payload.delta.y
                        }
                      }
                    }
                }
            } else {
                return side;
            }
          })
        }
      }
    },

    /**
     * pieces/toggleSideConstraintValue
     * @description toggles the value of a constraint. should only be used on booleans
     * @param pieceId the id of the piece to set the contraints of 
     * @param sideId the id of the piece to set the contraints on
     * @param constraintId the name of the constraint
     */
    toggleSideConstraintValue: (state, action) => {
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: state[action.payload.pieceId].sides.map(side => {
            if(side.id === action.payload.sideId) {
                return {
                    ...side, 
                    constraints: {
                      ...side.constraints,
                      [action.payload.constraintId]: {
                        ...side.constraints[action.payload.constraintId],
                        value: !side.constraints[action.payload.constraintId].value
                      }
                    }
                }
            } else {
                return side;
            }
          })
        }
      }
    },


    /**
     * pieces/toggleSideConstraintComputed
     * @description toggles whether the constraint is computed or not
     * @param pieceId the id of the piece to set the contraints of 
     * @param sideId the id of the piece to set the contraints on
     * @param constraintId the name of the constraint
     */
     toggleSideConstraintComputed: (state, action) => {
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: state[action.payload.pieceId].sides.map(side => {
            if(side.id === action.payload.sideId) {
                return {
                    ...side, 
                    constraints: {
                      ...side.constraints,
                      [action.payload.constraintId]: {
                        ...side.constraints[action.payload.constraintId],
                        computed: !side.constraints[action.payload.constraintId].computed
                      }
                    }
                }
            } else {
                return side;
            }
          })
        }
      }
    },
    

    /**
     * pieces/setSideStart
     * @description sets the start point of a side for a free form piece
     * @param pieceId the id of the piece to set the contraints of 
     * @param sideId the id of the piece to set the contraints on
     * @param start the start point to set the side to 
     */
    setSideStart: (state, action) => {
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: state[action.payload.pieceId].sides.map(side => {
            if(side.id === action.payload.sideId) {
                return {
                    ...side, 
                    start: action.payload.start
                }
            } else {
                return side;
            }
          })
        }
      }
    },

    /**
     * pieces/setSideEnd
     * @description sets the end point of a side for a free form piece
     * @param pieceId the id of the piece to set the contraints of 
     * @param sideId the id of the piece to set the contraints on
     * @param end the end point to set the side to 
     */
    setSideEnd: (state, action) => {
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: state[action.payload.pieceId].sides.map(side => {
            if(side.id === action.payload.sideId) {
                return {
                    ...side, 
                    end: action.payload.end
                }
            } else {
                return side;
            }
          })
        }
      }
    }
  }
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPieces = (state) => state.pieces;


export const { 
  addSide, removeSide, 
  setSideConstraintsValue,
  moveSideConstraintPoint,
  toggleConstraintComputed,
  toggleConstraintEnabled,
  toggleConstraintValue,
  setConstraintValue,
  renamePiece,
  loadPieces,
  toggleSideConstraintValue,
  toggleSideConstraintComputed,
  togglePieceConstraintComputed,
  setSideStart, setSideEnd,
  selectAllPieces, selectPiece,
  deselectAllPieces, deselectPiece,
  moveCirclePiece, movePiece, selectPieceAction,
  setPieceConstraintValue,
  addPiece,
  removePiece,
  setPieceConstraints,
  createPiece,
  createCirclePiece,
  removeAllPieces,
  selectPiecesAction,
} = piecesSlice.actions;

export default piecesSlice.reducer;


 















