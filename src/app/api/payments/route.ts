import { connectDatabase } from "@/server/database";
import Payment from "@/server/payment-schema"
import { NextResponse } from "next/server";

export async function  POST(req: Request) {
    try {
        await connectDatabase()
        const body = await req.json()
        const payment = await Payment.create(body);
        return NextResponse.json(payment, {status: 201});
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({error: message}, {status: 500});
    }
}



export async function GET(req: Request) {
    try {
        await connectDatabase();

        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const sortParam = searchParams.get('sort');

        const sortOptions: Record<string, 1 | -1> = {};
        if (sortParam) {
            // Handle sort parameter like "-createdAt" (descending)
            if (sortParam.startsWith('-')) {
                sortOptions[sortParam.substring(1)] = -1; // Descending
            } else {
                sortOptions[sortParam] = 1; // Ascending
            }
        } else {
            // Default sort by newest first
            sortOptions.createdAt = -1;
        }

        const payments = await Payment.find({}).sort(sortOptions);
        return NextResponse.json(payments, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDatabase();
        const body = await req.json();
        const { id, newAmount, paid } = body as {
            id?: string;
            newAmount?: number;
            paid?: number;
        };

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
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 })
    }
}


