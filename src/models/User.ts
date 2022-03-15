export type User = {
  userId: string
  email: string
  emailVerified: boolean
  thumbnail: string
  profile: UserProfile
  personalAppState: AppState
  likedSchools: string[]
}

export type UserProfile = {
  userId: string
  userFirebaseUuid: string
  profileStatus: number
  imageUrl: string
  firstName: string
  lastName: string
  profileText: string
  belongsTo: UserProfileBelongsTo
}

export type UserProfileBelongsTo = {
  _id: string
  name: string
  email: string
  emailVerified: string
  userId: string
}

export type AppState = {
  theme: {
    type: number
    required: true
  }
}
