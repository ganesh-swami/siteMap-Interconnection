import mongoose from "mongoose";

const PaymentIntentSchema = new mongoose.Schema({
    // userId: {
    //     type: String,
    //     required: [true, "Please provide a userId"],
    //     index:true
    // },
    paymentIntentId:{type:String,index:true},
    status: {
        type: String,
        default: 'Created',
    },
    stripeCustomerId:{type:String,index:true},
    amount:Number,
    // currency:String,
}, { timestamps: true })

const PaymentIntent = mongoose.models.paymentIntent || mongoose.model("paymentIntent", PaymentIntentSchema);

export default PaymentIntent;