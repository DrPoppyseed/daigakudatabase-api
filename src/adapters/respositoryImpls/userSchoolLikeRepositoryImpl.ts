import UserSchoolLikesRepository from '../repositories/userSchoolLikeRepository'
import { UserSchoolLike } from '../../models/UserSchoolLike'
import { MongooseStore } from '../../drivers/database/mongooseStore'

export default class UserSchoolLikesRepositoryImpl
  implements UserSchoolLikesRepository
{
  constructor(
    private readonly userSchoolLikeStore: MongooseStore<UserSchoolLike>
  ) {}

  getUserSchoolLike = async (
    userId: string
  ): Promise<UserSchoolLike[] | null> => {
    return this.userSchoolLikeStore.find({ user_id: userId }).exec()
  }
}
