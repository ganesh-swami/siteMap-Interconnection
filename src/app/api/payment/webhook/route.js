import Stripe from 'stripe';
import { NextResponse } from "next/server";
import { headers } from 'next/headers'
import logger from "src/utils/logger"; 
import Subscription from 'src/modals/subscriptionModal'
import PaymentIntent from 'src/modals/paymentIntent'
import Plan from 'src/modals/planModal';
import User from 'src/modals/userModal';
import dbConnect from "src/dbConfig/dbConfig";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ## removing because https://github.com/vercel/next.js/issues/49025
// Stripe requires the raw body to construct the event.
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const cors = Cors({
//   allowMethods: ['POST', 'HEAD'],
// });


export async function HEAD(request) {
    return NextResponse.json({ received: true }, {status: 200});
}

export async function POST(request) {
   
    logger.info('@webhook .... called');
    // logger.info('@webhook .... request',request);
    const req= request; // .json();

    // const buf = await buffer(req).catch((err)=>{
    //     logger.info('error in buffer ',err);
    // });
    const text = await request.text(); // https://github.com/vercel/next.js/issues/49025
    const headersList = headers();
    const signature = headersList.get("Stripe-Signature");
  
    // const signature = request.headers['stripe-signature'];
    logger.info('@webhook .... signature',signature);
    let event;
    try {
      event = stripe.webhooks.constructEvent(text, signature, webhookSecret);
    } catch (err) {
      // On error, log and return the error message.
      logger.info(`@webhook ❌ Error message: ${err.message}`);
    //   res.status(400).send(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, {status: 400});
    //   return;
    }

    // Successfully constructed event.
    logger.info('@webhook ✅ Event Success:', event.id, event.type);
    // logger.info('Event :', event);

    await dbConnect();
    switch (event.type) {
        case 'payment_intent.created':{
          const paymentIntent = event.data.object;
          // Then define and call a function to handle the event payment_intent.canceled
          handlePaymentIntent(paymentIntent,event.type);
          break;
        }
        case 'payment_intent.canceled':{
          const paymentIntent = event.data.object;
          // Then define and call a function to handle the event payment_intent.canceled
          handlePaymentIntent(paymentIntent,event.type);
          break;
        }
        case 'payment_intent.payment_failed':{
          const paymentIntent = event.data.object;
          // Then define and call a function to handle the event payment_intent.payment_failed
          handlePaymentIntent(paymentIntent,event.type);
          break;
        }
        case 'payment_intent.processing':{
          const paymentIntent = event.data.object;
          // Then define and call a function to handle the event payment_intent.processing
          handlePaymentIntent(paymentIntent,event.type);
          break;
        }
        case 'payment_intent.requires_action':{
          const paymentIntent = event.data.object;
          // Then define and call a function to handle the event payment_intent.requires_action
          handlePaymentIntent(paymentIntent,event.type);
          break;
        }
        case 'payment_intent.succeeded':{
          // logger.info('payment_intent.succeeded ')
          const paymentIntent = event.data.object;
          handlePaymentIntent(paymentIntent,event.type);
          // Then define and call a function to handle the event payment_intent.succeeded
          break;
        }
        
        case 'customer.subscription.updated':{
          const customerSubscription = event.data.object;
          // Then define and call a function to handle the event subscription_schedule.completed
          
          handleSubscription(customerSubscription,event.type);
          break;
        }
        case 'customer.subscription.created':{
          const customerSubscription = event.data.object;
          // Then define and call a function to handle the event subscription_schedule.completed
          logger.info('calling once ..... ');
          handleSubscription(customerSubscription,event.type);
          break;
        }
        case 'customer.subscription.deleted':{
          const customerSubscription = event.data.object;
          // Then define and call a function to handle the event subscription_schedule.completed
          handleSubscription(customerSubscription,event.type);
          break;
        }
        case 'customer.subscription.resumed':{
          const customerSubscription = event.data.object;
          // Then define and call a function to handle the event subscription_schedule.completed
          handleSubscription(customerSubscription,event.type);
          break;
        }
        case 'customer.subscription.paused':{
          const customerSubscription = event.data.object;
          // Then define and call a function to handle the event subscription_schedule.completed
          handleSubscription(customerSubscription,event.type);
          break;
        }
        // ... handle other event types
        default:
          logger.info(`Unhandled event type ${event.type}`);
      }

    // Return a response to acknowledge receipt of the event.
    // res.json({ received: true });
    return NextResponse.json({ received: true }, {status: 200});
}

function handlePaymentIntent(PI,type){
  // logger.info('@webhook PI',PI);
  if(type==='payment_intent.created'){
    const data = {
      paymentIntentId:PI.id,
      stripeCustomerId:PI.customer,
      status:PI.status,
      amount:PI.amount,
      // currency:PI.currency,
    }
    new PaymentIntent(data).save()
  }
  else{
    const data = {
      status:PI.status,
      amount:PI.amount,
    }
    const filter={
      paymentIntentId:PI.id
    }
    PaymentIntent.findOneAndUpdate(filter,data);
  }
}

async function handleSubscription(subscription,type){

  try{
    logger.info('@webhook subscription type ------------- ',type);
    if(type==='customer.subscription.created'){
      
      // logger.info('subscription',subscription)
      const updatedSubscription = await new Subscription({
        userId:subscription.metadata.userId,
        planId:subscription.metadata.planId,
        status:subscription.status,
        start_date:new Date(subscription.current_period_start*1000),
        end_date:new Date(subscription.current_period_end*1000),
        stripeSubscriptionId:subscription.id,
      }).save().catch(ee=>{logger.info('errrrrr ee',ee)});
      
      logger.info('@webhook done----- ',updatedSubscription);
      logger.info('@webhook @handleSubscription subscription.status----- ',subscription.status);
      if(subscription.status==='trialing'){
        handleActivateSubscription(subscription,updatedSubscription)
      }
    }
    else{
      logger.info('@webhook here ... ',subscription.id)
      const data = {
        // planId:subscription.metadata.planId,
        status:subscription.status,
        start_date:new Date(subscription.current_period_start*1000),
        end_date:new Date(subscription.current_period_end*1000),
      }
      const filter={
        stripeSubscriptionId:subscription.id
      }
      // logger.info('filter ... ',filter)
      // logger.info('data ... ',data)
      const updatedSubscription = await Subscription.findOneAndUpdate(filter,data).catch(err=>{
        logger.error('@webhook err ...',err);
      });
      if(subscription.status==='active'){
        // need to update it
        // logger.info('update user with topical limit')
        // const plan = await Plan.findById(subscription.metadata.planId);
        // if(plan){
        //   // update user according to 
        //   const planCredit =plan.topicalLimit;
        //   const userUpdateDetails={
        //     credit:planCredit,
        //     subscriptionId:updatedSubscription._id.toString(),
        //   }
        //   // let trialUsed=false;
        //   if(subscription.trial_start){
        //     userUpdateDetails.trialUsed=true;
        //   }
        //   // logger.info('@handleSubscription plan topicalLimit ',planCredit);
        //   // logger.info('@handleSubscription  subscription.metadata.userId ',subscription.metadata.userId);
          
        //   const usr = await User.findByIdAndUpdate(subscription.metadata.userId,userUpdateDetails)

        //   // logger.info('@handleSubscription usr',usr);
        // }
        handleActivateSubscription(subscription,updatedSubscription)

      }
      // else if(){ // paused,deleted
      //   // we can remove something
      // }
    }
  }
  catch(catchErr){
    logger.error('@webhook catchErr ',catchErr);
  }

}

const handleActivateSubscription =async (subscription,updatedSubscription)=>{

  try{
  const plan = await Plan.findById(subscription.metadata.planId);
  logger.info('@webhook @handleActivateSubscription plan ',plan)
  if(plan){
    // update user according to 
    const planCredit =plan.topicalLimit;
    const userUpdateDetails={
      // credit:planCredit,
      subscriptionId:updatedSubscription?._id?.toString(),
    }
    // let trialUsed=false;
    if(subscription.status==='trialing'){
      userUpdateDetails.trialUsed=true;
      userUpdateDetails.$inc={credit:1};
    }
    else{
      userUpdateDetails.$inc={credit:planCredit};
      // also unsubscribe previously subscribed plans
      // first get subscription id
      const user = await User.findById(subscription.metadata.userId);
      logger.info('@webhook subs user ',user);
      if(user && user?.subscriptionId){
        // now get stripe subscription id
        const prevSubscription = await Subscription.findById(user.subscriptionId,{stripeSubscriptionId:1})
        logger.info('@webhook prevSubscription.stripeSubscriptionId ',prevSubscription?.stripeSubscriptionId);

        if(prevSubscription?.stripeSubscriptionId){
          const cancelSubscription = await stripe.subscriptions.update(
            prevSubscription.stripeSubscriptionId,
            {
              cancel_at_period_end: true,
            }
          );
          logger.info('@webhook cancelSubscription',cancelSubscription?.id);
        }
      }
    }
    logger.info('@webhook @handleActivateSubscription userUpdateDetails ',userUpdateDetails);
    // logger.info('@handleSubscription  subscription.metadata.userId ',subscription.metadata.userId);
    
    const usr = await User.findByIdAndUpdate(subscription.metadata.userId,userUpdateDetails).catch(err=>{logger.info('errr',err)})

    // logger.info('@handleSubscription usr',usr);
  }
}
catch(err){
  logger.error('@webhook catch error = ',err);
}
}
