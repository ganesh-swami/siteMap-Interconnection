// it will create customer if not available and create subscription and return the client secret
import Stripe from "stripe";
import { NextResponse } from "next/server";
import logger from "src/utils/logger"; 
import {checkJWTAuth} from 'src/utils/middleware'
import Plan from 'src/modals/planModal'
import User from 'src/modals/userModal'
// import Subscription from 'src/modals/subscriptionModal'
import Transaction from 'src/modals/transactionModal'
import dbConnect from "src/dbConfig/dbConfig";

// This is your test secret API key.
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


// const calculateOrderAmount = (amount) => parseFloat(amount)*100;




export async function POST(request) {


  try{
  await dbConnect();
  const userInfo = await checkJWTAuth(request);
  const reqBody = await request.json()
  const {planId} = reqBody;
  const user = await User.findById(userInfo._id);
  const plan = await Plan.findById(planId);
  logger.info('@create-intent user email ',user.email);
  // logger.info('planId',planId);
  // logger.info('plan',plan);



  if(!plan || !plan.amount || plan.isActive===false){
    return NextResponse.json({error: "Something went wrong"}, {status: 400})
  }
  let stripeCustomerId=null;
  if(!user.stripeCustomerId){
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata:{
        userid:user._id
      }
    });
    logger.info('@create-intent customer.id',customer.id)

    stripeCustomerId=customer.id;

    await User.findByIdAndUpdate(user._id,{
      stripeCustomerId
    })
  }
  else{
    stripeCustomerId=user.stripeCustomerId;
  }
  

  const subscriptionData={
    customer: stripeCustomerId,
    items: [{
      price: plan.stripePriceId,
    }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    // trial_period_days:7,
    metadata:{
        userId:user._id.toString(),
        name:user.name,
        email:user.email,
        planId:plan._id.toString(),
        plan:plan.name
    }
  }

  let usingTrial=false;
  if(user?.trialUsed===false){
    usingTrial=true;
    subscriptionData.trial_period_days=process.env.TRIAL_PERIOD_DAYS;
  }

  // logger.info('@create-intent subscriptionData',subscriptionData)

  const subscription = await stripe.subscriptions.create(subscriptionData);

  logger.info('@create-intent subscription created ... ',subscription.id);
  // new Subscription({
  //   userId:user._id,
  //   stripeSubscriptionId:subscription.id,
  //   planId:plan._id
  // }).save()

  new Transaction({
    isTrial:usingTrial,
    userId:user._id,
    planId:plan._id,
    status:subscription.status,
    stripeSubscriptionId:subscription.id,
    stripeCustomerId:subscription.customer,
    stripePriceId:plan.stripePriceId,
    currency:subscription.currency,
    amount:plan.amount,
    current_period_start:subscription.current_period_start,
    current_period_end:subscription.current_period_end,
  }).save()


  const response = NextResponse.json({
    subscriptionId: subscription.id,
    clientSecret: usingTrial ? null : subscription.latest_invoice.payment_intent.client_secret,
    plan:plan.name,
    amount:plan.amount,
    success: true,
    isTrial:usingTrial,
})
return response;
  }
  catch(error){
    logger.error('@create-intent Error : ',error);
    return NextResponse.json({error: error.message}, {status: 500})
}

};