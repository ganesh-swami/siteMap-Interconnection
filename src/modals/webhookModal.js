import mongoose from "mongoose";

const webhookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    roleId: {
        type: Number,
        default: 6,
    },
    lastLogin:{
        type:Date,
        default:new Date().getTime()
    },
    // for email & password =1, google = 2
    creationType:{
        type:Number,
        default:1
    },
    jwtToken:String,
    jwtTokenExpiry:Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
}, { timestamps: true })

const Webhook = mongoose.models.webhooks || mongoose.model("webhooks", webhookSchema);

export default Webhook;