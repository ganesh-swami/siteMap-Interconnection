import { NextResponse } from "next/server";
import Stripe from 'stripe';
import logger  from "src/utils/logger"; 
import {checkJWTAuth} from 'src/utils/middleware'
import dbConnect from "src/dbConfig/dbConfig";
import Plan from 'src/modals/planModal'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (amount) => parseFloat(amount)*100;

export async function POST(req,res) {
    try{
        await dbConnect()
        // const admin = await checkJWTAuth(req,process.env.ADMIN_ROLE_ID);
        const reqBody = await req.json()
        const { name,topicalLimit,description,amount } = reqBody; // TrialDays,interval
        logger.info('@plan name',name);

        if(!(name && topicalLimit && description)){
            return NextResponse.json({error: 'provide all data'}, {status: 400})
        }
        const product = await stripe.products.create({
            name,
            description,
            metadata:{
                topicalLimit
            }
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: calculateOrderAmount(amount),
            currency: 'usd',
            recurring: {
              interval: 'day',
            },
        });
        
        

        const newPlan = new Plan({
            name,
            topicalLimit,
            description,
            amount,
            stripeProductId:product.id,
            stripePriceId:price.id,
            validity:1,
            topicalLimitDay:1,
        })

        const savedPlan = await newPlan.save()
        return NextResponse.json({
            plan:savedPlan._id.toString(),
            message: "Plan created successfully",
            success: true,

        })
    }
    catch(error){
        console.log('Error : ',error);
        return NextResponse.json({error: error.message}, {status: 500})
    }
};