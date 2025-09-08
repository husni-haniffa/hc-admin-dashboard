export interface Payment {
    _id: string
    phoneNumber: string
    amount: string,
    note?: String,
    paid: number
    balance: number
    paymentStatus: string
    createdAt?: string
    updatedAt?: string
}

export interface CreatePaymentRequest {
    phoneNumber: string
    amount: number
    note: string
}

export interface UpdatePaymentRequest {
    id: string
    paidAmount: number
    note: string
}
