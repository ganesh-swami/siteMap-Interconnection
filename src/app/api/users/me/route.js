import { NextResponse } from 'next/server';
import bcryptjs from "bcryptjs";
import  logger  from "src/utils/logger"; 
import { checkJWTAuth } from 'src/utils/middleware';
import Plan from 'src/modals/planModal';
import Subscription from 'src/modals/subscriptionModal';
import User from 'src/modals/userModal';
import dbConnect from 'src/dbConfig/dbConfig';



export async function GET(request) {
  try {
    await dbConnect();
    
    const userInfo = await checkJWTAuth(request);
    const filter ={
      status:{$in:['active','trialing']},
      end_date : {$gt: new Date()}
    };

    const activeSubscription = await Subscription.findOne(
      filter,
      null, 
      { sort: { timestamp: 1}}
    );
    let plan=null;
    logger.info('filter',filter);
    logger.info('activeSubscription',activeSubscription);
    
    if(activeSubscription?.planId){
      // this user have the plan get plan details
      const pln = await Plan.findById(activeSubscription?.planId,{amount:1,isActive:1,name:1,description:1});
      
      if(pln && pln._doc){
        plan=pln._doc;
        plan.subscriptionStatus=activeSubscription.status
      }
      // console.log('plan ... ',plan);
      // plan.subscriptionStatus=activeSubscription.status;

    }

    const response = NextResponse.json({
      message: 'success',
      success: true,
      user:userInfo,
      plan, // :{...plan,subscriptionStatus:activeSubscription?.status}
    });
    // console.log('called here ....');
    return response;
  } catch (error) {
    logger.error('users/me err : ', error);
    return NextResponse.json({ error: error.message, errCode: 'internalErr' }, { status: 500 });
  }
}


export async function PATCH(req, res) {
  try {
    await dbConnect();
    const reqBody = await req.json();
    const userInfo = await checkJWTAuth(req,process.env.USER_ROLE_IDS,true);
    const { name,blog,oldPassword,newPassword } = reqBody;
    const fieldsToUpdate={};
    logger.info('users/me @patch')
    if(name){
      fieldsToUpdate.name=name;
    }
    if(oldPassword && newPassword){
      // fieldsToUpdate.name=name;

      const validPassword = await bcryptjs.compare(oldPassword, userInfo.password);
      
      if(!validPassword){
          return NextResponse.json({error: "Password is not correct",errCode:'PwdNotMatch'}, {status: 400})
      }
      // hash password
      const salt = await bcryptjs.genSalt(10)
      const hashedPassword = await bcryptjs.hash(newPassword, salt);
      fieldsToUpdate.password=hashedPassword;
    }
    if(blog){
      fieldsToUpdate.blog=blog;
    }

    const updatedUser=await User.findOneAndUpdate(
      {
        _id:userInfo._id,
      },
      fieldsToUpdate,
      {
        new: true
      },
      {
        name:1,email:1,roleId:1
      }
    );

    return NextResponse.json({
      success: true,
      user:updatedUser
    });
  } catch (error) {
    logger.error('users/me @PATCH err : ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}