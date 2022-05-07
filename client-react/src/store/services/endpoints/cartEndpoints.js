import { api } from '../api'

export const cartEndpoints = api.injectEndpoints({
    endpoints: (build) => ({
        newCart: build.mutation({
            query: ({ itemId, quantity, userId }) => ({
                url: 'cart',
                method: 'POST',
                body: { itemId, quantity, userId }
            })
        }),
        getCart: build.query({
            query: (cartId) => ({
                url: `cart/${cartId}`,
                method: 'GET',
            }),
            transformResponse: (res) => ({
                _id: res.cart._id,
                items: res.cart.items,
                modified: res.modified
            })
        }),
        deleteCart: build.mutation({
            query: (cartId) => ({
                url: `cart/${cartId}`,
                method: 'DELETE',
            })
        }),
        updateItem: build.mutation({
            query: ({cartId, itemId, quantity }) => ({
                url: `cart/${cartId}`,
                method: 'PATCH',
                body: { itemId, quantity }
            })
        }),
        addItem: build.mutation({
            query: ({cartId, itemId, quantity }) => ({
                url: `cart/${cartId}/add-to-cart`,
                method: 'PATCH',
                body: { itemId, quantity }
            })
        }),
        removeItem: build.mutation({
            query: ({cartId, itemId }) => ({
                url: `cart/${cartId}/remove-from-cart`,
                method: 'PATCH',
                body: { itemId }
            })
        }),
        setCartUser: build.mutation({
            query: ({ cartId, userId}) => ({
                url: `cart/${cartId}/set-user`,
                method: 'PATCH',
                body: { userId }
            })
        }),
        mergeItems: build.mutation({
            query: ({ cartId, ...items}) => ({
                url: `cart/${cartId}/merge-carts`,
                method: 'PATCH',
                body: items
            })
        })
    })
})

export const {
    useNewCartMutation, 
    useGetCartQuery,
    useLazyGetCartQuery,
    useDeleteCartMutation, 
    useUpdateItemMutation, 
    useAddItemMutation, 
    useRemoveItemMutation,
    useSetCartUserMutation,
    useMergeItemsMutation
} = cartEndpoints;