import { configureStore } from '@reduxjs/toolkit';
import piecesReducer from '../features/pieces/piecesSlice';
import selectedPiecesIdReducer from '../features/selectedPiecesId/selectedPiecesIdSlice';
import lastPieceIdReducer from "../features/lastPieceId/lastPieceIdSlice";
import toolReducer from "../features/tool/toolSlice";
import selectionBoxReducer from "../features/selectionBox/selectionBoxSlice";
import logReducer from "../features/log/logSlice";
import panelSizesReducer from "../features/panel/panelSlice";
import axisLockReducer from '../features/axisLock/axisLockSlice';


export const store = configureStore({
  reducer: {
    pieces: piecesReducer,
    lastPieceId: lastPieceIdReducer, 
    selectedPiecesId: selectedPiecesIdReducer,
    tool: toolReducer,
    selectionBox: selectionBoxReducer,
    log: logReducer, 
    panelSizes: panelSizesReducer, 
    axisLock: axisLockReducer
  },
});
