import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
    {
        phoneNumber: { type: String, required: true },
        amount: { type: Number, required: true, default: 0 },  
        paid: { type: Number, default: 0 },                    
        balance: { type: Number, default: 0 }, 
        note: {type: String, required: false},              
        paymentStatus: { type: String, default: "Pending" }
    },
    {timestamps: true}
);

PaymentSchema.pre("save", function(next) {
    this.balance = this.amount - this.paid

    if (this.paid === 0) {
        this.paymentStatus = "Pending"
    }else if (this.paid < this.amount) {
        this.paymentStatus = "Partial"
    }else {
        this.paymentStatus = "Paid"
    }
    next()
}) 

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)