import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    hidden: true
}

export const selectionBoxSlice = createSlice({
    name: "selectionBox",
    initialState,
    reducers: {
        setSelectionBoxWidth: (state, action) => {
            return {...state, width: action.payload}
        },
        setSelectionBoxHeight: (state, action) => {
            return {...state, height: action.payload}
        },
        setSelectionBoxX: (state, action) => {
            return {...state, x: action.payload}
        },
        setSelectionBoxY: (state, action) => {
            return {...state, y: action.payload}
        },
        hideSelectionBox: (state, action) => {
            return {...state, hidden: true}
        },
        showSelectionBox: (state, action) => {
            return {...state, hidden: false}
        }
    }
}) 

export const selectSelectionBox = (state) => state.selectionBox

export const { 
    setSelectionBoxWidth, 
    setSelectionBoxHeight, 
    setSelectionBoxX, 
    setSelectionBoxY, 
    hideSelectionBox, 
    showSelectionBox 
} = selectionBoxSlice.actions;


export default selectionBoxSlice.reducer;


