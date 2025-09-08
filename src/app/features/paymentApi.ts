import { CreatePaymentRequest, Payment, UpdatePaymentRequest } from '@/lib/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const paymentsApi = createApi({
    reducerPath: 'paymentsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Payment'],
    endpoints: (builder) => ({
        // Fetch all payments
        getPayments: builder.query<Payment[], void>({
            query: () => '/payments',
            providesTags: (result = []) => [
                ...result.map(({ _id }) => ({ type: 'Payment' as const, id: _id })),
                { type: 'Payment' as const, id: 'LIST' },
            ],
        }),

        // Fetch payment by ID
        getPaymentById: builder.query<Payment, string>({
            query: (id) => `/payments/${id}`,
            providesTags: (result, error, id) => [{ type: 'Payment', id }],
        }),

        // Create a payment
        createPayment: builder.mutation<Payment, CreatePaymentRequest>({
            query: (newPayment) => ({
                url: '/payments',
                method: 'POST',
                body: newPayment,
            }),
            invalidatesTags: [{ type: 'Payment', id: 'LIST' }],
        }),

        // Update a payment
        updatePayment: builder.mutation<Payment, UpdatePaymentRequest>({
            query: ({ id, ...updates }) => ({
                url: `/payments/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Payment', id },
                { type: 'Payment', id: 'LIST' },
            ],
        }),
    }),
})

export const {
    useGetPaymentsQuery,
    useGetPaymentByIdQuery,
    useCreatePaymentMutation,
    useUpdatePaymentMutation,
} = paymentsApi
