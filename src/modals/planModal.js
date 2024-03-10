import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required: [true, "Please provide plan amount"]
    },
    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    description: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
        index:true
    },
    isCustom: {
        type: Boolean,
        default: false,
    },
    type:{
        type:String,
        enum: ['RECURRING', 'ONETIME'],
        default:'RECURRING'
    },
    validity:{
        type:Number,
        default:30
    },
    topicalLimit:{
        type:Number,
        default:3
    },
    topicalLimitDay:{
        type:Number,
        default:30
    },
    stripeProductId:String,
    stripePriceId:String
}, { timestamps: true })

const Plan = mongoose.models.plans || mongoose.model("plans", planSchema);

export default Plan;