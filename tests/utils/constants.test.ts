import {
  BAD_REQUEST_ERROR_MESSAGE,
  BAD_VALUE_ERROR_MESSAGE,
  CANNOT_ACCESS_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  MISSING_TOKEN_ERROR_MESSAGE,
} from '../../src/utils/constants'

describe('constants', () => {
  describe('errors messages', () => {
    it('return correct error message', () => {
      expect(INTERNAL_SERVER_ERROR_MESSAGE).toEqual(
        'サーバーエラーが発生しました。'
      )
      expect(CANNOT_ACCESS_ERROR_MESSAGE).toEqual(
        'アクセス権限エラー：ユーザーの認証情報の取得に失敗しました。'
      )
      expect(BAD_REQUEST_ERROR_MESSAGE).toEqual(
        'リクエストに何かしらの不備があります。'
      )
      expect(MISSING_TOKEN_ERROR_MESSAGE).toEqual(
        'リクエストにトークンがありません。'
      )
      expect(BAD_VALUE_ERROR_MESSAGE).toEqual(
        'ユーザが入力された値を受け付けることができません。'
      )
    })
  })
})
