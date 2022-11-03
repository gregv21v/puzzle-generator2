import { createSlice } from '@reduxjs/toolkit';

const initialState = 1;

export const lastPieceId = createSlice({
  name: 'lastPieceId',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    /**
     * setlastPieceId
     * @description sets the selected piece id
     */
    incrementLastPieceId: (state, action) => {
      return state + 1;
    }
  }
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectLastPieceId = (state) => state.lastPieceId;

export const { incrementLastPieceId } = lastPieceId.actions;

export default lastPieceId.reducer;
