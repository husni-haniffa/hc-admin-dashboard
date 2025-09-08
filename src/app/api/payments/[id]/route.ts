import { connectDatabase } from "@/server/database";
import { NextResponse } from "next/server";
import Payment from "@/server/payment-schema"


export async function GET(req: any, { params }: { params: {id: string}}) {
    try {
        await connectDatabase()
        const {id} = params
        if (!id) {
            return NextResponse.json({ message: "No Id provided" }, { status: 400 });
        }
        const payment = await Payment.findById(id)
        return NextResponse.json(payment, {status: 200})
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
    try {
        await connectDatabase();
        const body = await req.json();
        const { paidAmount, note} = body
        const id = params.id;
        if (!id) {
            return NextResponse.json({ message: "No Id provided" }, { status: 400 });
        }
        const payment = await Payment.findById(id)

        if (!payment) {
            return NextResponse.json({ message: "Payment info not found" }, { status: 400 });
        }
        if (payment.paid === 0) {
            payment.paid = paidAmount
            payment.balance = payment.amount - payment.paid

            if(payment.paid === 0) {
                payment.paymentStatus = "Pending"
            } else if (payment.paid < payment.amount){
                payment.paymentStatus = "Partial"
            }else {
                payment.paymentStatus = "Paid"
            }
            
            if(payment.note === "") {
                payment.note = note
            }else{
                payment.note = payment.note + "|" + note
            }

            await payment.save();
        }
        
        
        return NextResponse.json(payment, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}