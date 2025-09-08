import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
    {
        phoneNumber: { type: String, required: true },
        amount: { type: Number, required: true, default: 0 },
        note: { type: String, required: true },
        paid: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },
        paymentStatus: { type: String, default: "Pending" }
    },
    { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
