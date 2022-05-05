import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './reducers/cartSlice'
import userReducer from './reducers/userSlice'
import shopReducer from './reducers/shopSlice'
import { api } from "./services/api";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        user: userReducer,
        shop: shopReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(api.middleware)
})