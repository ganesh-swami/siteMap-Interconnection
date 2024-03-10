import { NextResponse } from 'next/server';
import axios from 'axios';
import logger from "src/utils/logger"; 
import TopicalMap from 'src/modals/topicalMapModal';
import { checkJWTAuth } from 'src/utils/middleware';
import dbConnect from 'src/dbConfig/dbConfig';
import User from 'src/modals/userModal'

export async function POST(req, res) {
  try {
    await dbConnect();
    const user = await checkJWTAuth(req, process.env.USER_ROLE_ID);
    logger.info('@topical user .... ', user);
    if(!user.credit || user.credit<1){
      return NextResponse.json({ error: 'Please Upgrade your plan as 0 credit left' }, { status: 400 });
    }
    const reqBody = await req.json();
    const { url } = reqBody;

    const postURI = new URL(url);
    if (!postURI) {
      return NextResponse.json({ error: 'provide correct post URL' }, { status: 400 });
    }

    

    logger.info('@topical topical map entry : ',url);
    const newTopicalMap = new TopicalMap({
      origin: postURI.origin,
      url,
      status: 'PROCESSING',
      userId:user._id
    })

    const topicalMap = await newTopicalMap.save();


    logger.info('@topical topical map entry : ',topicalMap);

    
    const apiURL = `${process.env.CRAWLER_API_URI}/getTopicalMap?token=${process.env.CRAWLER_TOKEN}&url=${url}&topicalMapId=${topicalMap._id}`;
    // just submit the request and make another api to listen for the response and save data to DB
    // once data is available frontend will retrie to fetch the response
    axios.get(apiURL);

    // now update the user credit 
    await User.findByIdAndUpdate(user._id,{credit:user.credit-1});

    return NextResponse.json({
      id: topicalMap._id,
      message: 'Topical Map creation is in progress',
      success: true,
    });
  } catch (error) {
    logger.info('@topical Error : ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req, res) {
  try {
    await dbConnect();
    const user = await checkJWTAuth(req, process.env.USER_ROLE_IDS);
    const { searchParams } = new URL(req.url);
    const topicalMapId = searchParams.get('topicalId');
    if (!topicalMapId) {
      return NextResponse.json({ error: 'something went wrong' }, { status: 400 });
    }

    const topicalMap = await TopicalMap.findById(topicalMapId);
    logger.info('@topical getting topical map for :',topicalMap.origin)
    return NextResponse.json({
      topicalMap,
      success: true,
    });
  } catch (error) {
    logger.info('@topical Error : ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, res) {
  try {
    logger.info('@topical  PATCH =================================================');
    await dbConnect();
    const reqBody = await req.json();
    logger.info('@topical Topical Patch reqBody', reqBody);
    const { success, url, topicalData, token,topicalMapId } = reqBody;

    if (token !== process.env.CRAWLER_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 500 });
    }
    let topicalMap=null;
    let title=null;
    let status='FAILED';
    if(success === true && topicalData){
      topicalMap=JSON.stringify(topicalData);
      title=topicalData[0]?.title;
      status='COMPLETED';

      

      await TopicalMap.findByIdAndUpdate(topicalMapId,
        {
          topicalMap,
          status,
          title,
        }
      );

      // get the serp data here
      logger.info('@topical topicalData : ',topicalData);
      getAndUpdateSERPData(topicalMapId,topicalData);

    }
    

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    logger.error('@topical Error : ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const getAndUpdateSERPData = async (topicalMapId,topicalData)=>{
  const newTopicalData = await Promise.all(
   topicalData.map(async (topical)=>{
    const URL =topical.url;
    const API_URL = `${process.env.SERP_API_URI}?url=${URL}&location=United%20States&hl=English&key=${process.env.SERP_API_KEY}`;
    logger.info('@topical apiURL',API_URL)
    try{
      const result = await axios.get(API_URL);
      // logger.info('@topical result ===== ',result.data.data);
      if(result?.data?.data){
        const resData=result.data.data;
        topical.organic_traffic=resData["organic traffic"];
        if(resData?.data && resData?.data.length>0){
          const mainSERPData=resData?.data[0];
          topical.keyword= mainSERPData.keyword;
          topical.position= mainSERPData?.result['serp position'];
          topical.backLink= mainSERPData?.result['backlink statistics'];
          topical.volume = mainSERPData['monthly search volume'];
          topical.difficulty = mainSERPData['keyword difficulty'];
        }
      }
      return topical;
    }
    catch(err){
      logger.error('@topical error ',err)
      return topical;
    }

    })
  )

  logger.info('@topical newTopicalData ',newTopicalData);
  const topicalMap = JSON.stringify(newTopicalData);
  const updatedData = await TopicalMap.findByIdAndUpdate(topicalMapId,
    {
      topicalMap
    },
    {
      new:true
    }

  );

  logger.info('@topical updatedData ',updatedData);
  

}
