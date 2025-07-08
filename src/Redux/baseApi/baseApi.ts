import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://assignment-3-update.vercel.app/api' }),
    tagTypes: ['books', 'borrow'],
    endpoints: (build) => ({
        getAllBooks: build.query({
            query: () => `/books`,
            providesTags: ['books']
        }),
        bookDetails: build.query({
            query: (bookId) => {
                return {
                    url: `/books/${bookId}`,
                    method: 'GET'
                }
            }
        }),
        createBook: build.mutation({
            query: (bookData) => {
                return {
                    url: '/books',
                    method: 'POST',
                    body: bookData
                }
            },
            invalidatesTags: ['books']
        }),
        deleteBook: build.mutation({
            query: (bookId) => {
                return {
                    url: `/books/${bookId}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: ['books']
        }),
        updateBook: build.mutation({
            query: (payload) => {
                return {
                    url: `/books/${payload.id}`,
                    method: 'PUT',
                    body: payload.data
                }
            },
            invalidatesTags: ['books']
        }),

        borrowBook: build.mutation({
            query: (payload) => {
                return {
                    url: `/borrow`,
                    method: 'POST',
                    body: payload
                }
            },
            invalidatesTags: ['books', 'borrow']
        }),
        getAllBorrow: build.query({
            query: () => {
                return {
                    url: '/borrow',
                    method: 'GET'
                }
            },
            providesTags: ['borrow']
        })
    })
})

export const {
    useGetAllBooksQuery,
    useBookDetailsQuery,
    useCreateBookMutation,
    useDeleteBookMutation,
    useUpdateBookMutation,
    useBorrowBookMutation,
    useGetAllBorrowQuery
} = baseApi