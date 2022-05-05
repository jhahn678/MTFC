import { api } from '../api'


const authEndpoints = api.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials
            })
        }),
        register: build.mutation({
            query: (newUser) => ({
                url: 'auth/register',
                method: 'POST',
                body: newUser
            })  
        }),
        googleLogin: build.mutation({
            query: token => ({
                url: 'auth/google',
                method: 'POST',
                body: token
            })
        })
    })
})

export const { useLoginMutation, useRegisterMutation, useGoogleLoginMutation } = authEndpoints;