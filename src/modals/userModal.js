import mongoose from 'mongoose';

require('mongoose-type-url');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a email'],
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    // 1 => super admin, 2=> admin .....
    // 6 => normal active user, 7=> active with plan
    roleId: {
      type: Number,
      default: 6,
    },
    lastLogin: {
      type: Date,
      default: new Date().getTime(),
    },
    // for email & password =1, google = 2
    creationType: {
      type: Number,
      default: 1,
    },
    blog:{
      type:mongoose.SchemaTypes.Url
    },
    credit:{
      type:Number,
      default:0,
    },
    trialUsed:{
      type:Boolean,
      default:false
    },
    subscriptionId:String,
    stripeCustomerId: String,
    jwtToken: String,
    jwtTokenExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;
