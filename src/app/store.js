import { configureStore } from '@reduxjs/toolkit';
import piecesReducer from '../features/pieces/piecesSlice';
import selectedPieceIdReducer from '../features/selectedPieceId/selectedPieceIdSlice';
import lastPieceIdReducer from "../features/lastPieceId/lastPieceIdSlice";
import toolReducer from "../features/tool/toolSlice";
import selectionBoxReducer from "../features/selectionBox/selectionBoxSlice";
import logReducer from "../features/log/logSlice";
import panelSizesReducer from "../features/panel/panelSlice";

export const store = configureStore({
  reducer: {
    pieces: piecesReducer,
    lastPieceId: lastPieceIdReducer, 
    selectedPieceId: selectedPieceIdReducer,
    tool: toolReducer,
    selectionBox: selectionBoxReducer,
    log: logReducer, 
    panelSizes: panelSizesReducer
  },
});
