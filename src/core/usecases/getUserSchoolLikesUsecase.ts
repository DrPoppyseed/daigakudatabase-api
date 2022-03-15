import { UserSchoolLike } from '../../models/UserSchoolLike'

export default interface GetUserSchoolLikesUsecase {
  call: (userId: string) => Promise<UserSchoolLike[] | null>
}
