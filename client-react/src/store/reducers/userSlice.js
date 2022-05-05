import { createSlice } from "@reduxjs/toolkit";


const resetLocalStorage = () => {
    localStorage.removeItem('TOKEN')
    localStorage.removeItem('TOKEN_DATE')
    localStorage.removeItem('USER_FIRSTNAME')
    localStorage.removeItem('USER_ID')
}

const evaluateToken = () => {
    const token = localStorage.getItem('TOKEN')
    const tokenDate = JSON.parse(localStorage.getItem('TOKEN_DATE'))
    if (!token || !tokenDate || (Date.now() - tokenDate) > (29.5 * 24 * 60 * 60 * 1000)) {
        resetLocalStorage();
        return false;
    }
    return true;
}

const createInitialState = () => {
    if(evaluateToken()){
        return {
            isAuthenticated: true,
            firstName: localStorage.getItem('USER_FIRSTNAME'),
            userId: localStorage.getItem('USER_ID'),
            token: localStorage.getItem('TOKEN')
        }
    }
    return {
        isAuthenticated: false,
        firstName: null,
        userId: null,
        token: null
    }
}

const userSlice = createSlice({
    name: 'user',
    initialState: createInitialState(),
    reducers: {
        setUser: (state, action) => {
            state.isAuthenticated = true;
            state.userId = action.payload.userId;
            state.firstName = action.payload.firstName;
            state.token = action.payload.token;
            localStorage.setItem('USER_FIRSTNAME', action.payload.firstName)
            localStorage.setItem('USER_ID', action.payload.userId)
            localStorage.setItem('TOKEN', action.payload.token)
            localStorage.setItem('TOKEN_DATE', Date.now())
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.firstName = null;
            state.userId = null
            state.token = null;
            resetLocalStorage();
        }
    }
})

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;