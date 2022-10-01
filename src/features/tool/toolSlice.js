import { createSlice } from '@reduxjs/toolkit';

const initialState = "Selection";

export const tool = createSlice({
  name: 'tool',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setTool: (state, action) => {
      return action.payload;
    }
  }
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectTool = (state) => state.tool;

export const { setTool } = tool.actions;

export default tool.reducer;
