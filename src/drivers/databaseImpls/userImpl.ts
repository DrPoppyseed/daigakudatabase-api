import { model, Schema, Document } from 'mongoose'
import { User } from '../../models/User'

const UserSchema = new Schema<User & Document>(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    profile: {
      userId: Schema.Types.ObjectId,
      userFirebaseId: String,
      profileStatus: Number,
      imageUrl: String,
      imageThumbUrl: String,
      firstName: String,
      lastName: String,
      profileText: String,
      belongsTo: {
        _id: Schema.Types.ObjectId,
        name: String,
        email: String,
        emailVerified: String,
        userId: Schema.Types.ObjectId,
      },
    },
    personalAppState: {
      theme: {
        type: Number,
        required: true,
      },
    },
    likedSchools: [String],
  },
  { timestamps: true }
)

export default model<User & Document>('User', UserSchema)
