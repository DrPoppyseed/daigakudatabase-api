import GetUserSchoolLikesUsecase from '../usecases/getUserSchoolLikesUsecase'
import UserSchoolLikesRepository from '../../adapters/repositories/userSchoolLikeRepository'
import { UserSchoolLike } from '../../models/UserSchoolLike'

export default class GetUserSchoolLikesUsecaseImpl
  implements GetUserSchoolLikesUsecase
{
  constructor(
    private readonly userSchoolLikesRepository: UserSchoolLikesRepository
  ) {}

  call = async (userId: string): Promise<UserSchoolLike[] | null> => {
    return this.userSchoolLikesRepository.getUserSchoolLike(userId)
  }
}
