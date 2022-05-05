import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    quantity: 0,
    total: 0,
    id: null
}

///Cart item
// {
//     variant: { }
//     quantity: quantity
// }


const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        addToCart(state, action){ //{  variant, quantity }
            state.quantity += action.payload.quantity
            state.total += (action.payload.quantity * action.payload.variant.price)
            const itemExistsInCart = state.items.find(item => item.variant._id === action.payload.variant._id)
            itemExistsInCart ? itemExistsInCart.quantity += action.payload.quantity : state.items.push(action.payload)
        },
        removeFromCart(state, action){ //{ itemId }
            const existingItem = state.items.find(item => item.variant._id === action.payload.itemId)
            state.quantity -= existingItem.quantity;
            state.total -= (existingItem.quantity * existingItem.variant.price)
            state.items = state.items.filter(item => item != existingItem)
        },
        updateItemQuantity(state, action){ //{  itemId, quantity }
            const existingItem = state.items.find(item => item.variant._id === action.payload.itemId)
            if(action.payload.quantity < 1){
                state.quantity -= existingItem.quantity;
                state.total -= (existingItem.quantity * existingItem.variant.price)
                state.items = state.items.filter(item => item != existingItem)
            }else{
                state.quantity = (state.quantity - existingItem.quantity + action.payload.quantity)
                state.total = state.total - (existingItem.variant.price * existingItem.quantity) + (existingItem.variant.price * action.payload.quantity)
                existingItem.quantity = action.payload.quantity;
                const items = state.items.filter(item => item.variant._id !== action.payload.itemId)
                state.items = [...items, existingItem]
            }
        },
        setCart(state, action){ //{  items: [{ variant: {}, quantity }], cartId }
            state.items = action.payload.items;
            state.quantity = action.payload.items.reduce((x, y) => x + y.quantity, 0);
            state.total = action.payload.items.reduce((x, y) => x + (y.quantity * y.variant.price), 0);
            state.id = action.payload.cartId;
        },
        resetCart(state){
            localStorage.removeItem('CART_ID')
            return initialState;
        },
        setCartId(state, action){ //{ cartId }
            state.id = action.payload.cartId;
            localStorage.setItem('CART_ID', action.payload.cartId)
        },
    }
})

export const { addToCart, removeFromCart, updateItemQuantity, setCart, resetCart, setCartId } = cartSlice.actions

export default cartSlice.reducer
