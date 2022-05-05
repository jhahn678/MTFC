import { api } from '../api'

export const productEndpoints = api.injectEndpoints({
    endpoints: (build) => ({
        getProducts: build.query({
            query: query => `products${query}`,
        }),
        getProduct: build.query({
            query: slug => `products/${slug}`,
        }),
        getProductsByCategory: build.query({
            query: ({ slug, query }) => {
                return `products/category/${slug}${query}`
            }
        }),
        getAllCategories: build.query({
            query: () => 'categories'
        }),
        getFeaturedCategories: build.query({
            query: () => 'categories/featured'
        }),
        getFeaturedProducts: build.query({
            query: () => 'products/featured'
        }),
        getSimilarProducts: build.query({
            query: slug => `products/${slug}/similar`
        }),
        searchProducts: build.query({
            query: search => `products/search?value=${search}`
        })
    })
})

export const { 
    useGetProductsQuery, 
    useGetProductQuery, 
    useGetProductsByCategoryQuery, 
    useGetAllCategoriesQuery, 
    useGetFeaturedProductsQuery,
    useGetFeaturedCategoriesQuery,
    useGetSimilarProductsQuery,
    useLazySearchProductsQuery
} = productEndpoints;