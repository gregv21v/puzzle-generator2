import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  {
    id: 0, 
    x: 100,
    y: 100,
    selected: true,
    useSideLength: false, 
    color: "blue",
    constraints: {
        rotation: 0,
        radius: 40,
        sideLength: 40
    },
    sides: [
      {
        id: 0, 
        constraints: {
          subdivisions: 3, tabLength: 10, startIn: false
        }
      },
      {
        id: 1, 
        constraints: {
          subdivisions: 3, tabLength: 10, startIn: false
        }
      },
      {
        id: 2, 
        constraints: {
          subdivisions: 3, tabLength: 10, startIn: false
        }
      }
    ]
  }   
];

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
      return state.map(piece => {
        return {...piece, selected: true}
      })
    },

    /**
     * deselectAllPieces()
     * @description deselects all the pieces
     */
    deselectAllPieces: (state) => {
      return state.map(piece => {
        return {...piece, selected: false}
      })
    },

    /**
     * selectPiece
     * @description selects a list of piece
     * @param pieceIds the ids of the pieces to select 
     */
    selectPiecesAction: (state, action) => {
      return state.map(piece => {
        if(action.payload.includes(piece.id)) {
            return {
                ...piece,
                selected: true
            }
        } else {
            return piece 
        }
      })
    },

    /**
     * deselectPiece()
     * @description deselects a list of pieces
     * @param pieceIds the ids of the pieces to deselect 
     */
    deselectPiece: (state, action) => {
      return state.map(piece => {
          if(action.payload.includes(piece.id)) {
              return {
                  ...piece,
                  selected: false
              }
          } else {
              return piece 
          }
      })
    },

    /**
     * pieceUseRadius()
     * @description instructs the piece to use the radius for rendering
     * @param pieceId the piece to use the radius for rendering for 
     */
    pieceUseRadius: (state, action) => {
      return state.map(piece => {
        if(piece.id === action.payload) {
            return {
                ...piece,
                useSideLength: false
            }
        } else {
            return {...piece}
        }
      })
    },

    /**
     * pieceUseSideLength()
     * @description instructs the piece to use the side length for rendering
     * @param pieceId the piece to use the side length for rendering for 
     */
    pieceUseSideLength: (state, action) => {
      return state.map(piece => {
        if(piece.id === action.payload) {
            return {
                ...piece,
                useSideLength: true
            }
        } else {
            return {...piece}
        }
      })
    },

    /**
     * movePiece() 
     * @description changes the position of a piece
     * @param pieceId the id of the piece to move 
     * @param x the x coordinate to move the piece to 
     * @param y the y coordinate to move the piece to 
     */
    movePiece: (state, action) => {
      return state.map(piece => {
        if(piece.id === action.payload.pieceId) {
            return {...piece, x: action.payload.x, y: action.payload.y}
        } else {
            return piece;
        }
      })
    },


    /**
     * removeAllPieces()
     * @description removes all pieces
     */
    removeAllPieces: (state, action) => {
      return []
    },

    /**
     * createPiece()
     * @description creates a new piece from scratch
     */
    createPiece: (state, action) => {
      return [
        ...state, 
        {
          id: 0, 
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
      ]
    },
   
    /**
     * addPiece() 
     * @description adds a piece to the list of pieces
     * @param payload the piece to add
     */
    addPiece: (state, action) => {
      return [...state, {...action.payload, id: state.length, selected: false}]
    },

    /**
    * removePiece()
    * @description removes a piece from the list of pieces
    * @param payload the piece to remove
    */
    removePiece: (state, action) => { 
      return state.filter(piece => piece.id !== action.payload)
    },


    /**
    * setPieceConstraints() 
    * @description sets the constraints of a specific piece
    * @param pieceId the id of the piece to set the contraints of 
    * @param constraints the new constraints
    */
    setPieceConstraints: (state, action) => {
      return state.map(piece => {
          if(piece.id === action.payload.pieceId) {
              return {
                  ...piece, 
                  constraints: Object.assign(
                      {}, piece.constraints, action.payload.constraints
                  )
              }
          } else {
              return piece
          }
      })
    },

    /**
     * sides/addSide
     * @description add a side to the list of sides of a given piece 
     * @param pieceId the id of the piece to add the side to 
     * @param side the side to add to the piece
     */
    addSide: (state, action) => {
      return state.map(piece => {
        if(piece.id === action.payload.pieceId) {
            return {...piece, sides: [...piece.sides, {...action.payload.side, id: piece.sides.length }]} 
        } else {
            return piece;
        }
      })
    },

    /**
     * sides/removeSide
     * @description remove a side from the given piece
     * @param pieceId the id of the piece to remove the side from 
     * @param sideId the id of the side to remove from the piece
     */
    removeSide: (state, action) => {
      return state.map(piece => {
        if(piece.id === action.payload.pieceId) {
            return {...piece, sides: piece.sides.filter(side => side.id !== action.payload.sideId)} 
        } else {
            return piece;
        }
      })
    },
    /**
     * pieces/setConstraints
     * @description sets the constraints of a side of a certain piece
     * @param pieceId the id of the piece to set the contraints of 
     * @param sideId the id of the piece to set the contraints on
     * @param constraints the new constraints
     */
    setSideConstraints: (state, action) => {
      return state.map(piece => {
        if(piece.id === action.payload.pieceId) {
            return {
                ...piece, sides: piece.sides.map(side => {
                    if(side.id === action.payload.sideId) {
                        return {
                            ...side, 
                            constraints: Object.assign(
                                {}, side.constraints, action.payload.constraints
                            )
                        }
                    } else {
                        return side;
                    }
                })
            }
        } else {
            return piece;
        }
      })
    }
  }
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPieces = (state) => state.pieces;


export const { 
  addSide, removeSide, setSideConstraints,
  selectAllPieces, selectPiece,
  deselectAllPieces, deselectPiece,
  movePiece,
  addPiece,
  removePiece,
  setPieceConstraints,
  createPiece,
  removeAllPieces,
  selectPiecesAction,
  pieceUseRadius,
  pieceUseSideLength
} = piecesSlice.actions;

export default piecesSlice.reducer;


 















