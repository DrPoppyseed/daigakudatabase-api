import mongoose from 'mongoose'
import { InternalError } from '../utils/error'

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING as string)
  } catch (error) {
    console.log(error)
    throw new InternalError(JSON.stringify(error))
  }
}

export default connect
