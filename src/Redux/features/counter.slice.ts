import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../store"


export type TCount = {
    value: number
}

const initialState: TCount = {
    value: 0
}

export const counterSlice = createSlice({
    name: 'Counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value = + 1
        }
    }
})

export const { increment } = counterSlice.actions
export const selectCount = (state: RootState) => state.counter.value
export default counterSlice.reducer