import type { Document, Model } from 'mongoose'

export type GenericStore<T> = Model<T & Document>
