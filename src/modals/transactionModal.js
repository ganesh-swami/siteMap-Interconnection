import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Please provide a userId"],
        index:true
    },
    planId: {
        type: String,
        required: [true, "Please provide a planid"],
    },
    isTrial:{
        type:Boolean,
    },
    stripeSubscriptionId:String,
    stripeCustomerId:String,
    stripePriceId:String,
    amount:Number,
    currency:String,
    current_period_start:Date,
    current_period_end:Date
}, { timestamps: true })

const Transaction = mongoose.models.transactions || mongoose.model("transaction", TransactionSchema);

export default Transaction;