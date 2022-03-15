import { UserSchoolLike } from '../../models/UserSchoolLike'

export default interface UserSchoolLikesRepository {
  getUserSchoolLike: (userId: string) => Promise<UserSchoolLike[] | null>
}
