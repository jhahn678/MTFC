import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    // search: '',
    sort: '',
    page: 1,
    limit: 15
}

const shopSlice = createSlice({
    name: 'shop',
    initialState: initialState,
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload
        },
        removeSearch: state => {
            state.search = ''
        },
        setPage: (state, action) => {
            state.page = action.payload
        },
        setLimit: (state, action) => {
            if(action.payload > 30){
                state.page = 1
            }
            state.limit = action.payload
        },
        setSort: (state, action) => {
            state.sort = action.payload
        },
        removeSort: state => {
            state.sort = ''
        },
        setAll: (state, action) => {
            return action.payload
        },
        reset: (state) => initialState
    }
})

export const { 
    setSearchTerm, 
    removeSearchTerm, 
    setPage,
    setLimit,
    setSort, 
    removeSort, 
    setAll,
    reset 
} = shopSlice.actions
export default shopSlice.reducer;