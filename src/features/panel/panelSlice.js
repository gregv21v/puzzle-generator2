import { createSlice } from '@reduxjs/toolkit';

const initialState = [1/3 * 100, 1/3 * 100, 1/3 * 100];

export const panelSizes = createSlice({
  name: 'panelSizes',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    /**
     * setPanelSize()
     * @description sets the size of a given panel
     * @param panelIndex the index of the panel in the array
     * @param newSize the new size of the panel
     */
    setPanelSize: (state, action) => {
      state[action.payload.panelIndex] = action.payload.newSize;
    },

    /**
     * setPanelSizes()
     * @description sets the size of all the panels
     * @param payload the size of all the panels
     */
    setPanelSizes: (state, action) => {
        return action.payload;
    }
  }
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPanelSizes = (state) => state.panelSizes;

export const { setPanelSize, setPanelSizes } = panelSizes.actions;

export default panelSizes.reducer;
