import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from 'src/dbConfig/dbConfig';
import User from 'src/modals/userModal';

const verifyJwt = (req, roleIds,fetchPassword) =>
  new Promise((resolve, reject) => {
    const ipAddr = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '0.0.0.0';
    console.log('IP addr : ', ipAddr);
    const bearerToken = req.headers.get('authorization');
    if (!bearerToken || bearerToken?.split(' ')[0] !== 'Bearer') {
      console.log('err --- session err')
      reject(new Error('session error'));
    }

    const jwtToken = bearerToken.split(' ')[1];
    console.log('jwtToken: ', jwtToken);
    try {
      jwt.verify(jwtToken, process.env.TOKEN_SECRET, { expiresIn: '1d' }, (err, userInfo) => {
        console.log('userinfo',userInfo);
        console.log('errrrr ',err);
        if (err || !userInfo || !userInfo.email) {
          console.log('hhhhhhhhh')
          reject(new Error('JWT token is not correct'));
        }
        getUserViaEmail(userInfo.email,fetchPassword)
          .then((user) => {
            console.log('user?.roleId...', user?.roleId);
            if (user?.roleId && roleIds.includes(parseInt(user.roleId, 10))) {
              // === parseInt(roleIds, 10)
              resolve(user);
            }
            else{
              console.log('Role Id Not matched',user?.roleId)
              reject(new Error('Role Id Not matched'));
            }
            
          })
          .catch((er) => {
            console.log('aaa')
            console.log('er',er)
            reject(er);
          });
      });
    } catch (err) {
      console.log('err .... ', err);
      reject(err);
    }
  });

const unAuthorizeError = (resp) => {
  resp.json({ error: 'you are not authorized.', errCode: 'unAuthorized' }, { status: 401 });
};

export const checkJWTAuth = async (req, roleIds = process.env.USER_ROLE_IDS,fetchPassword=false) =>
  verifyJwt(req, roleIds,fetchPassword)
    .then((res) => {
      console.log('@checkJWTAuth res?.email ... ', res?.email);
      return res;
    })
    .catch((er) => {
      console.log('err', er);
      unAuthorizeError(NextResponse);
      return null;
    })
    .finally(() => {
      console.log('finally');
      unAuthorizeError(NextResponse);
      return null;
    });

async function getUserViaEmail(email,fetchPassword) {
  await dbConnect();
  const select={'name':1,'email':1,'roleId':1,'credit':1,'trialUsed':1};
  if(fetchPassword===true){
    select.password=1
  }
  
  const user = await User.findOne({ email },select).catch((err) => console.error(err));
  return user;
}
