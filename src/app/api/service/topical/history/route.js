import { NextResponse } from 'next/server';
import logger from "src/utils/logger"; 
import TopicalMap from 'src/modals/topicalMapModal';
import { checkJWTAuth } from 'src/utils/middleware';
import dbConnect from 'src/dbConfig/dbConfig';

export async function GET(req, res) {
  try {
    await dbConnect();
    const user = await checkJWTAuth(req, process.env.USER_ROLE_IDS);
    const { searchParams } = new URL(req.url);
    let page = searchParams.get('page');
    if (!page) {
        page=1;
    }
    const skip = (page-1)*20

    logger.info('@topicalHis skip :',skip)
    const topicalMaps = await TopicalMap.find({userId:user._id},{origin: 1,
      url:1,
      status:1,
      userId:1,
      title:1,
      createdAt:1,
    }).sort({createdAt: -1}).skip(skip).limit(20);
    // logger.info('@topicalHis get last 20 topical maps :',topicalMaps)
    return NextResponse.json({
      topicalMaps,
      success: true,
      error:null
    });
  } catch (error) {
    logger.info('@topicalHis Error : ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
