import { api } from '../api'

export const userEndpoints = api.injectEndpoints({
    endpoints: (build) => ({
        getUserOrders: build.query({
            query: (id) => ({
                url: `user/${id}/orders`,
                method: 'GET'
            })
        }),
        getUser: build.query({
            query: (id) => ({
                url: `user/${id}`,
                method:'GET'
            })
        }),
        updateAccountDetails: build.mutation({
            query: ({ id, patch }) => ({
                url: `user/${id}`,
                method: 'PATCH',
                body: patch
            })
        })
    })
})

export const { useGetUserOrdersQuery, useGetUserQuery, useUpdateAccountDetailsMutation } = userEndpoints
