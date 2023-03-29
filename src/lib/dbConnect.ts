import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let cached = global.mongoose

if (!cached) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cached = global.mongoose = { conn: null, promise: null }
}

console.log('logdd', MONGODB_URI)

async function dbConnect () {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        cached.promise = mongoose.connect(MONGODB_URI!).then(mongoose => {
            console.log('mongoose', mongoose.connections)
            console.log('succ')

            
            return mongoose
        })
    }
    cached.conn = await cached.promise

    return cached.conn
}

export default dbConnect