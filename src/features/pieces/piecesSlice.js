import { createSlice, current } from '@reduxjs/toolkit';
import _ from "lodash";
import { generateRectangularPiece, generateSidedPiece, generateCirclePiece } from '../util/predefinedPieces';

const initialState = {
  0: generateSidedPiece(0),
  1: generateRectangularPiece(1)
};


export const piecesSlice = createSlice({
  name: 'pieces',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    /**
     * pieceAddVertex() 
     * @description adds a vertex to a piece
     * @param {integer} pieceId the id of the piece to add the vertex to
     * @param {point} vertex the vertex to add to the piece
     */
    pieceAddVertex: (state, action) => {
      state[action.payload.pieceId].vertices.push(action.payload.vertex)
    },

    /**
     * pieceAddEdge()
     * @description adds a edge to a piece
     * @param {Number} pieceId the id of the piece 
     * @param {Edge} edge the new edge to add
     */
    pieceAddEdge: (state, action) => {
      state[action.payload.pieceId].edges.push(action.payload.edge)
    },


    /**
     * pieceSetVertex()
     * @description sets the coordinates of the vertex
     * @param {Number} pieceId the id of the piece
     * @param {Number} vertexId the id of the vertex
     * @param {Point} vertex the new vertex
     */
    pieceSetVertex: (state, action) => {
      state[action.payload.pieceId].vertices[action.payload.vertexId] = action.payload.vertex;
    },


    /**
     * moveSideUp()
     * @description moves the side of a piece up
     * @param {integer} pieceId the id of the piece
     * @param {integer} location the location of the side in the current ordering 
     */
    moveSideUp: (state, action) => {
      let currentState = current(state);
      console.log(currentState);
      let location = action.payload.location
      let length = currentState[action.payload.pieceId].order.length;
      let slotAbove = (location - 1 < 0) ? length-1 : location - 1;
      console.log(location);
      console.log(slotAbove);

      // swap the two sides
      let temp = currentState[action.payload.pieceId].order[location]
      state[action.payload.pieceId].order[location] = currentState[action.payload.pieceId].order[slotAbove]
      state[action.payload.pieceId].order[slotAbove] = temp;
    },

    /**
     * moveSideDown()
     * @description moves the side of a piece down
     * @param {integer} pieceId the id of the piece
     * @param {integer} location the location of the side in the current ordering 
     */
    moveSideDown: (state, action) => {
      let currentState = current(state);
      let location = action.payload.location
      let length = currentState[action.payload.pieceId].order.length;
      let slotBelow = (location + 1) % length;

      // swap the two sides
      let temp = currentState[action.payload.pieceId].order[location]
      state[action.payload.pieceId].order[location] = currentState[action.payload.pieceId].order[slotBelow]
      state[action.payload.pieceId].order[slotBelow] = temp;
    },

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
        if(action.payload.includes(parseInt(key))) {
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
        if(parseInt(key) === action.payload) {
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
     * moveVertex() 
     * @description changes the position of a vertex 
     * @param pieceId the id of the piece to move 
     * @param vertexId the id of the vertex to move
     * @param x the change in x that took place as a result of dragging 
     * @param y the change in y that took place as a result of dragging
     */
     moveVertex: (state, action) => {
      state[action.payload.pieceId].sides[action.payload.vertexId].constraints.startPoint.value = {
        x: action.payload.x,
        y: action.payload.y
      }
    },

    /**
     * moveVertex2() 
     * @description changes the position of a vertex 
     * @param pieceId the id of the piece to move 
     * @param vertexId the id of the vertex to move
     * @param x the change in x that took place as a result of dragging 
     * @param y the change in y that took place as a result of dragging
     */
    moveVertex2: (state, action) => {
      state[action.payload.pieceId].vertices[action.payload.vertexId] = {
        x: action.payload.x,
        y: action.payload.y
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
    * removePieces()
    * @description removes an array of pieces from the list of pieces
    * @param payload the ids of the piece to remove
    */
    removePieces: (state, action) => { 
      let newPieces = {};
      for (const key of Object.keys(state)) {
        if(!action.payload.includes(parseInt(key))) {
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
      //console.log();
      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: {
            ...state[action.payload.pieceId].sides,
            [action.payload.side.id]: action.payload.side
          },
          order: [...state[action.payload.pieceId].order].concat(action.payload.side.id)
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
      let order = []
      for (const key of state[action.payload.pieceId].order) {
        if(key !== action.payload.sideId)
          order.push(key)
      }

      return {
        ...state,
        [action.payload.pieceId]:{
          ...state[action.payload.pieceId],
          sides: newSides,
          order
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
  moveCirclePiece, movePiece, moveVertex, selectPieceAction,
  pieceAddVertex, pieceAddEdge,
  pieceSetVertex,
  moveSideUp, moveSideDown,
  setPieceConstraintValue,
  addPiece,
  removePieces,
  setPieceConstraints,
  createPiece,
  createCirclePiece,
  removeAllPieces,
  selectPiecesAction,
} = piecesSlice.actions;

export default piecesSlice.reducer;


 















