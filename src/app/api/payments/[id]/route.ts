import { connectDatabase } from "@/server/database";
import { NextResponse } from "next/server";
import Payment from "@/server/payment-schema"


export async function GET(req: any, { params }: { params: Promise<{id: string}>}) {
    try {
        await connectDatabase()
        const {id} = await params
        if (!id) {
            return NextResponse.json({ message: "No Id provided" }, { status: 400 });
        }
        const payment = await Payment.findById(id)
        return NextResponse.json(payment, {status: 200})
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}

export async function PUT(req: any, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDatabase();
        const body = await req.json();
        const { paidAmount, note} = body
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ message: "No Id provided" }, { status: 400 });
        }
        const payment = await Payment.findById(id)

        if (!payment) {
            return NextResponse.json({ message: "Payment info not found" }, { status: 400 });
        }

        // Accumulate paid amount
        payment.paid += paidAmount;
        payment.balance = payment.amount - payment.paid;

        // Update status based on balance
        if (payment.balance === 0) {
            payment.paymentStatus = "Paid";
        } else if (payment.paid > 0 && payment.balance > 0) {
            payment.paymentStatus = "Partial";
        } else {
            payment.paymentStatus = "Unpaid";
        }

        // Append note if provided
        if (note && note.trim() !== "") {
            if (payment.note && payment.note.trim() !== "") {
                payment.note += " | " + note;
            } else {
                payment.note = note;
            }
        }

        await payment.save();
        
        
        return NextResponse.json(payment, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}