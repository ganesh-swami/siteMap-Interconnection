import mongoose from 'mongoose';
import logger from 'src/utils/logger'

// export async function connect() {
//     try {
//         mongoose.connect(process.env.MONGO_URI!);
//         const connection = mongoose.connection;

//         connection.on('connected', () => {
//             console.log('MongoDB connected successfully');
//         })

//         connection.on('error', (err) => {
//             console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
//             process.exit();
//         })

//     } catch (error) {
//         console.log('Something goes wrong!');
//         console.log(error);
        
//     }


// }



// import mongoose from 'mongoose'

// /** 
// Source : 
// https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js 
// **/

// 
const MONGODB_URI = process.env.ENVIRONMENT ==='LOCAL' ? process.env.MONGO_URI_LOCAL : process.env.MONGO_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  global.mongoose = { conn: null, promise: null }
  cached = global.mongoose
}

async function dbConnect () {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(moongoose => moongoose).catch(err=>{
      logger.error('MongoError : ',err);
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect;