const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
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

module.exports = mongoose.model("User", userSchema)
