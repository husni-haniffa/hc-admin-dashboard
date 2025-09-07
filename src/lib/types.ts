export interface Payment {
    _id: string
    phoneNumber: string
    amount: string,
    paid: number
    balance: number
    note?: String,
    paymentStatus: string
    createdAt?: string
    updatedAt?: string
}

export interface CreatePaymentRequest {
    phoneNumber: string
    amount: number
}

export interface UpdatePaymentRequest {
    id: string
    newAmount?: number
    paid?: number
    note?: number
}
