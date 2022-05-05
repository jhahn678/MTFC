import { api } from '../api'

export const orderEndpoints = api.injectEndpoints({
    endpoints: (build) => ({
        getOrderById: build.query({
            query: id => ({
                url: `orders/${id}`,
                method: 'GET'
            })
        })
    })
})

export const { useGetOrderByIdQuery, useLazyGetOrderByIdQuery } = orderEndpoints;