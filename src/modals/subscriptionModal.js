import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Please provide a userId"],
        index:true
    },
    status: {
        type: String,
        default: 'created',
        index:true
    },
    planId: {
        type: String,
        required: [true, "Please provide a planid"],
    },
    stripeSubscriptionId:{
        type:String,
        index:true
    },
    start_date:Date,
    end_date:{
        type:Date,
        index:true
    },
}, { timestamps: true })

const Subscription = mongoose.models.subscriptions || mongoose.model("subscriptions", subscriptionSchema);

export default Subscription;