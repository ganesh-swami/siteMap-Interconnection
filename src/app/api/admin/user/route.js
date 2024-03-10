import { NextResponse } from 'next/server';
import { checkJWTAuth } from 'src/utils/middleware';
import dbConnect from '../../../../dbConfig/dbConfig';
import User from '../../../../modals/userModal';

export async function GET(req) {
  try {
    await dbConnect();

    const userInfo = await checkJWTAuth(req, process.env.ADMIN_ROLE_ID);
    const { searchParams } = new URL(req.url);
    let page = searchParams.get('page');
    if(!page){
        page=1;
    }
    const skip = (page-1)*20;
    const users = await User.find({}).skip(skip).limit(20);

    const response = NextResponse.json({
      message: 'success',
      success: true,
      users,
    });
    
    return response;
  } catch (error) {
    console.log('Error ', error);
    return NextResponse.json({ error: error.message, errCode: 'internalErr' }, { status: 500 });
  }
}

export async function PATCH(req, res) {
  try {
    await dbConnect();
    const reqBody = await req.json();
    const { name,blog,email } = reqBody;
    const fieldsToUpdate={};
    if(name){
      fieldsToUpdate.name=name;
    }
    if(email){
      fieldsToUpdate.name=name;
    }
    if(blog){
      fieldsToUpdate.blog=blog;
    }

    const userInfo = await checkJWTAuth(req);

    await User.findOneAndUpdate(
      {
        _id:userInfo._id,
      },
      fieldsToUpdate
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log('Error : ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}