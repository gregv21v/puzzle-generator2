import { createSlice } from '@reduxjs/toolkit';

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
  "0": {
    id: 0, 
    type: "sided",
    x: 100,
    y: 100,
    selected: true,
    color: "blue",
    constraints: {
        rotation: {type: "number", value: 0, computed: false},
        radius: {type: "number", value: 40, computed: false},
        sideLength: {type: "number", value: 40, computed: true}
    },
    sides: [
      {
        id: 0, 
        type: "line",
        constraints: {
          startPoint: {type: "point", value: {x: 50, y: 50}, computed: true},
          endPoint: {type: "point", value: {x: 50, y: 50}, computed: true},
          subdivisions: {type: "number", value: 3, computed: true},
          length: {type: "number", value: 20, computed: false},
          tabWidth: {type: "number", value: 20, computed: false},
          tabLength: {type: "number", value: 10, computed: false},
          startIn: {type: "boolean", value: false, computed: false}  
        }
      },
      {
        id: 1, 
        type: "line",
        constraints: {
          startPoint: {type: "point", value: {x: 50, y: 50}, computed: true},
          endPoint: {type: "point", value: {x: 50, y: 50}, computed: true},
          subdivisions: {type: "number", value: 3, computed: true},
          length: {type: "number", value: 20, computed: false},
          tabWidth: {type: "number", value: 20, computed: false},
          tabLength: {type: "number", value: 10, computed: false},
          startIn: {type: "boolean", value: false, computed: false}  
        }
      },
      {
        id: 2, 
        type: "line",
        constraints: {
          startPoint: {type: "point", value: {x: 50, y: 50}, computed: true},
          endPoint: {type: "point", value: {x: 50, y: 50}, computed: true},
          subdivisions: {type: "number", value: 3, computed: true},
          length: {type: "number", value: 20, computed: false},
          tabWidth: {type: "number", value: 20, computed: false},
          tabLength: {type: "number", value: 10, computed: false},
          startIn: {type: "boolean", value: false, computed: false}  
        }
      },
      /*{
        id: 2, 
        type: "arcTo",
        constraints: {
          radius: 30,
          subdivisions: 5,
          tabLength: 10,
          startIn: false
        }
      },*/
      {
        id: 3, 
        type: "line",
        constraints: {
          startPoint: {type: "point", value: {x: 50, y: 50}, computed: true},
          endPoint: {type: "point", value: {x: 50, y: 50}, computed: true},
          subdivisions: {type: "number", value: 3, computed: true},
          length: {type: "number", value: 20, computed: false},
          tabWidth: {type: "number", value: 20, computed: false},
          tabLength: {type: "number", value: 10, computed: false},
          startIn: {type: "boolean", value: false, computed: false}  
        }
      }
    ]
  },

  "1": {
    id: 1, 
    type: "circle",
    x: 200,
    y: 200,
    color: "blue",
    selected: false,
    constraints: {
      radius: 40
    },
  },

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
     * movePiece() 
     * @description changes the position of a piece
     * @param pieceId the id of the piece to move 
     * @param x the x coordinate to move the piece to 
     * @param y the y coordinate to move the piece to 
     */
    movePiece: (state, action) => {
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          x: action.payload.x,
          y: action.payload.y
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
     * @description creates a new piece from scratch
     */
    createPiece: (state, action) => {
      return {
        ...state, 
        [action.payload]:{
          id: 0, 
          type: "sided",
          x: 100,
          y: 100,
          selected: false,
          useSideLength: false, 
          color: "blue",
          constraints: {
              rotation: 0,
              radius: 40,
              sideLength: 40
          },
          sides: []
        }
      }
    },


    /**
     * createCirclePiece()
     * @description creates a new circle piece from scratch
     */
    createCirclePiece: (state, action) => {
      return {
        ...state, 
        [action.payload]:{
          id: 0, 
          type: "circle",
          x: 100,
          y: 100,
          selected: false,
          color: "blue",
          constraints: {
            radius: 40
          }
        }
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
      console.log(newPieces);
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
    * @param constraints the new constraints
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
  toggleSideConstraintValue,
  toggleSideConstraintComputed,
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


 















