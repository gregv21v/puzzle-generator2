import { createSlice } from '@reduxjs/toolkit';

const initialState = 'n';

// You can lock the axis in the x, y or none axis.
// locking the axis in the none axis is represented by n

export const axisLockSlice = createSlice({
  name: 'axisLock',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    /**
     * setAxisLock()
     * @description sets the axis to lock to
     * @param payload the new axisLock
     */
    setAxisLock: (state, action) => {
        return action.payload;
    }
  }
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAxisLock = (state) => state.axisLock;


export const { 
  setAxisLock
} = axisLockSlice.actions;

export default axisLockSlice.reducer;

