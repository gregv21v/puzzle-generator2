import { createSlice } from '@reduxjs/toolkit';

const initialState = "";

export const logSlice = createSlice({
  name: 'log',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    /**
     * setText()
     * @description sets the text of the log
     * @param payload the new text
     */
    setText: (state, action) => {
        return action.payload;
    }
  }
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPieces = (state) => state.pieces;


export const { 
  setText
} = logSlice.actions;

export default logSlice.reducer;


 















