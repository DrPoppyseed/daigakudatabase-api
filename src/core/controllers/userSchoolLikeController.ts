import GetUserSchoolLikesUsecaseImpl from '../usecaseImpls/getUserSchoolLikesUsecaseImpl'
import GetUserSchoolLikesUsecase from '../usecases/getUserSchoolLikesUsecase'
import { MongooseStore } from '../../drivers/database/mongooseStore'
import { UserSchoolLike } from '../../models/UserSchoolLike'
import UserSchoolLikesRepositoryImpl from '../../adapters/respositoryImpls/userSchoolLikeRepositoryImpl'
import { Request, Response, NextFunction } from 'express'
import { InternalError } from '../../utils/error'
import logger from '../../config/logger'

export default class UserSchoolLikeController {
  private getUserSchoolLikesUsecase: GetUserSchoolLikesUsecase

  constructor(userSchoolLikeStoreClient: MongooseStore<UserSchoolLike>) {
    const userSchoolLikesRepository = new UserSchoolLikesRepositoryImpl(
      userSchoolLikeStoreClient
    )

    this.getUserSchoolLikesUsecase = new GetUserSchoolLikesUsecaseImpl(
      userSchoolLikesRepository
    )
  }

  getUserLikes = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId

    try {
      const schoolLikes = await this.getUserSchoolLikesUsecase.call(userId)
      const likedSchoolIds = schoolLikes?.map(el => el.ipeds_unitid)
      res.status(200).json({
        schoolIds: likedSchoolIds,
      })
    } catch (error) {
      logger.error(error)
      next(new InternalError())
    }
  }
}
