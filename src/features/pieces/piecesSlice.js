import { createSlice, current } from '@reduxjs/toolkit';
import { getPointOnPolygon } from '../util/geometry';
import { dist } from '../util/util';
import _ from "lodash";

// What do I need pieces to be able to do?
// remove a piece without disruting the other piece ids 
// change a property in all the pieces at once 

// Solutions 
/// 1
// Store the objects in an array
// Update their ids every time a piece is remove
// if there are a lot of pieces this could take a lot of time
/// 2
// Store the objects in a map.
// Whenever you remove a piece, just delete the key value pair
// 


const initialState = {
  "0": generateSidedPiece(0),

  "1": generateCirclePiece(1),

  /*"2": {
    id: 2,
    type: "free",
    selected: false,
    x: 0,
    y: 0,
    constraints: {
        tabLength: 10,
        tabWidth: 10,
        subdivisions: 3
    },
    sides: [
        {
            id: 0,
            type: "line"
            constraints: {
              startPoint: {type: "point", displayName: "Start", value: {x: 50, y: 50}, computed: true},
              endPoint: {type: "point", displayName: "End", value: {x: 50, y: 50}, computed: true}
              subdivisions: {type: "number", displayName: "Subdivisions", value: 3, computed: true},
              tabLength: {type: "number", displayName: "Tab Length", value: 10, computed: false},
              startIn: {type: "boolean", displayName: "Start In", value: false, computed: false},
              tabWidth: {type: "number", displayName: "Tab Width", value: 20, computed: false}
            }
        }
    ]
  }*/
};


export function generateLineSide(id, start={x: 0, y: 0}, end={x: 0, y: 0}, length=20) {
  return {
    id,
    constraints: {
      type: {type: "string", value: "line", computed: true},
      startPoint: {type: "point", value: start, computed: true},
      endPoint: {type: "point", value: end, computed: true},
      subdivisions: {type: "number", value: 3, computed: true},
      length: {type: "number", value: length, computed: false},
      tabWidth: {type: "number", value: 20, computed: false},
      tabLength: {type: "number", value: 10, computed: false},
      startIn: {type: "boolean", value: false, computed: false}  
    }
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
export function generateSidedPiece(id, constraintName="radius", value=40, sideCount=3, x=0, y=0, selected = true) {
  let newPiece = {
    id, 
    selected,
    color: "blue",
    constraints: {
      type: {type: "string", value: "sided", computed: true},
      position: {type: "point", value: {x, y}, computed: true},
      rotation: {type: "number", value: 0, computed: false},
      radius: {type: "number", value: 50, computed: false},
      sideLength: {type: "number", value: 50, computed: false}
    },
    sides: {}
  }


  let theta = 360 / sideCount
  if(constraintName === "radius") {
    newPiece.constraints.sideLength.computed = true 
    newPiece.constraints.radius.value = value
    newPiece.constraints.sideLength.value = dist(
        getPointOnPolygon({x, y}, value, 0),
        getPointOnPolygon({x, y}, value, theta)
    )

  } else if(constraintName === "sideLength") {
    // update 
    newPiece.constraints.radius.computed = true;
    newPiece.constraints.sideLength.value = value
    newPiece.constraints.radius.value = newPiece.constraints.sideLength.value / (2 * Math.tan((theta/2) * (Math.PI / 180)))
    
  }


  for (let index = 0; index < sideCount; index++) {
    let angle1 = (index) * (360 / sideCount)
    let angle2 = (index+1) * (360 / sideCount)

    newPiece.sides[index] = generateLineSide(
      index, 
      { // start point
        x: x + newPiece.constraints.radius.value * Math.sin(angle1 * (Math.PI / 180)),
        y: y + newPiece.constraints.radius.value * Math.cos(angle1 * (Math.PI / 180))
      },
      { // end point
        x: x + newPiece.constraints.radius.value * Math.sin(angle2 * (Math.PI / 180)),
        y: y + newPiece.constraints.radius.value * Math.cos(angle2 * (Math.PI / 180))
      },
      newPiece.constraints.sideLength.value
    );
  }

  return newPiece;
}

/**
 * generateFreePiece()
 * @description generates a free draw piece
 * @param {id} id the id of the free piece
 * @param {boolean} selected whether the piece is selected or not
 * @returns a free draw piece
 */
export function generateFreePiece(id, selected=true) {
  return {
    id, 
    selected,
    color: "blue",
    constraints: {
      type: {type: "string", value: "free", computed: true}
    },
    sides: {}
  }
} 


export function generateCirclePiece(id, x=0, y=0, radius=50) {
  return {
    id,
    color: "blue",
    constraints: {
      type: {type: "string", value: "circle", computed: true},
      center: {type: "point", value: {x, y}, computed: true},
      radius: {type: "number", value: radius, computed: false},
    }
  }
}


/**
 * mergeConstraints()
 * @descripition merge two lists of constraints
 * @param {object} constraints1 the first list of constraints
 * @param {object} constraints2 the second list of constraints
 */
export function mergeConstraints(constraints1, constraints2) {
  
}

/**
 * updateConstraints()
 * @descripition updates an original list of constraints with new values. The new list of constraints
 *  does not need to specify all the needed values. The orignal does
 * @param {object} original the original list of constraints
 * @param {object} newValues the new values list of constraints
 */
export function updateConstraints(original, newValues) {
  let newConstraints = {...original};
  for (const key of Object.keys(newValues)) {
    newConstraints[key] = {
      ...newConstraints[key],
      ...newValues[key]
    }
  }
  return newConstraints;
}



export const piecesSlice = createSlice({
  name: 'pieces',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
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
     * @param pieceIds the ids of the pieces to select 
     */
    selectPiecesAction: (state, action) => {
      let newPieces = {};
      for (const key of Object.keys(state)) {
        newPieces[key] = {
          ...state[key],
          selected: action.payload.includes(state[key].id)
        }
      }
      return newPieces;
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
     * pieceUseRadius()
     * @description instructs the piece to use the radius for rendering
     * @param pieceId the piece to use the radius for rendering for 
     */
    pieceUseRadius: (state, action) => {
      return {
        ...state,
        [action.payload]:{
          ...state[action.payload],
          useSideLength: false
        }
      }
    },

    /**
     * pieceUseSideLength()
     * @description instructs the piece to use the side length for rendering
     * @param pieceId the piece to use the side length for rendering for 
     */
    pieceUseSideLength: (state, action) => {
      return {
        ...state,
        [action.payload]:{
          ...state[action.payload],
          useSideLength: true
        }
      }
    },

    

    /**
     * moveFreePiece() 
     * @description changes the position of a piece of type free
     * @param pieceId the id of the piece to move 
     * @param dx the change in x that took place as a result of dragging 
     * @param dy the change in y that took place as a result of dragging
     */
    moveFreePiece: (state, action) => {
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: state[action.payload.pieceId].sides.map(side => {
            return {
              ...side,
              start: {
                x: side.start.x + action.payload.dx,
                y: side.start.y + action.payload.dy
              },
              end: {
                x: side.end.x + action.payload.dx,
                y: side.end.y + action.payload.dy
              }
            }
          })
        }
      }
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
          sides: [
            ...state[action.payload.pieceId].sides, 
            {...action.payload.side, id: state[action.payload.pieceId].sides.length }
          ] 
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
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: state[action.payload.pieceId].sides.filter(side => side.id !== action.payload.sideId)
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
  toggleConstraintValue,
  setConstraintValue,
  toggleSideConstraintValue,
  toggleSideConstraintComputed,
  togglePieceConstraintComputed,
  setSideStart, setSideEnd,
  selectAllPieces, selectPiece,
  deselectAllPieces, deselectPiece,
  movePiece, moveFreePiece,
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


 















