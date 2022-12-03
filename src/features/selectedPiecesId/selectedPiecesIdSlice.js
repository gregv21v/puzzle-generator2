import { createSlice } from '@reduxjs/toolkit';

const initialState = [0];

export const selectedPiecesIdSlice = createSlice({
  name: 'selectedPiecesId',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    /**
     * setSelectedPieceId
     * @description sets the selected piece id
     */
    setSelectedPiecesId: (state, action) => {
      return action.payload;
    }
  }
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectSelectedPiecesId = (state) => state.selectedPiecesId;

export const { setSelectedPiecesId } = selectedPiecesIdSlice.actions;

export default selectedPiecesIdSlice.reducer;
