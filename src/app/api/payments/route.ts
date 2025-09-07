import { connectDatabase } from "@/server/database";
import Payment from "@/server/payment-schema"
import { NextResponse } from "next/server";

export async function  POST(req: any) {
    try {
        await connectDatabase()
        const body = await req.json()
        const payment = await Payment.create(body);
        return NextResponse.json(payment, {status: 201});
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function GET(req: any, { params }: { params: { id: string } }) {
    try {
        await connectDatabase()
        const { id } = params;
        if( id ) {
            const payment = await Payment.findById(id)
            if( !payment ) {
                return NextResponse.json({message: "Payment info not found"}, {status: 404})

            }
            return NextResponse.json(payment, { status: 200 })  
        }

        const payments = await Payment.find({});
        return NextResponse.json(payments, {status:200})      
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }   
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
    try {
        await connectDatabase();
        const body = await req.json();
        const { id } = params;
        const { newAmount, paid } = body;

        if (!id) {
            return NextResponse.json({ message: "No Id provided" }, { status: 400 });
        }
        const payment = await Payment.findById(id);
        if (!payment) {
            return NextResponse.json({ message: "Payment info not found" }, { status: 404 });
        }
        if (typeof newAmount === "number" && newAmount > 0) {
            payment.amount += newAmount;
        }

        if (typeof paid === "number" && paid > 0) {
            payment.paid += paid;
        }
        await payment.save();
        return NextResponse.json(payment, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


