import { configureStore } from '@reduxjs/toolkit';
import piecesReducer from '../features/pieces/piecesSlice';
import selectedPieceIdReducer from '../features/selectedPieceId/selectedPieceIdSlice';
import lastPieceIdReducer from "../features/lastPieceId/lastPieceIdSlice";
import toolReducer from "../features/tool/toolSlice"
import selectionBoxReducer from "../features/selectionBox/selectionBoxSlice"

export const store = configureStore({
  reducer: {
    pieces: piecesReducer,
    lastPieceId: lastPieceIdReducer, 
    selectedPieceId: selectedPieceIdReducer,
    tool: toolReducer,
    selectionBox: selectionBoxReducer
  },
});