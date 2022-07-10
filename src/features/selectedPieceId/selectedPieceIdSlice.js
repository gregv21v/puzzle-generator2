import { createSlice } from '@reduxjs/toolkit';

const initialState = 0;

export const selectedPieceId = createSlice({
  name: 'selectedPieceId',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    /**
     * setSelectedPieceId
     * @description sets the selected piece id
     */
    setSelectedPieceId: (state, action) => {
      return action.payload;
    }
  }
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectSelectedPieceId = (state) => state.selectedPieceId;

export const { setSelectedPieceId } = selectedPieceId.actions;

export default selectedPieceId.reducer;
