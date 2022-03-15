import type { Document, Model } from 'mongoose'

export type MongooseStore<T> = Model<T & Document>
