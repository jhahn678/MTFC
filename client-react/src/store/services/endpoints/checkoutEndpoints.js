import { api } from '../api'

export const checkoutEndpoints = api.injectEndpoints({
    endpoints: (build) => ({
        startCheckoutCustomFlow: build.mutation({
            query: ({ cartId, ...cart }) => ({
                url: `checkout/create-payment-intent/${cartId}`,
                method: 'POST',
                body: cart
            })
        }),
        startCheckout: build.mutation({
            query: cartId => ({
                url: `checkout/create-stripe-session`,
                method: 'POST',
                body: cartId
            })
        })
    })
})

export const { useStartCheckoutMutation } = checkoutEndpoints;