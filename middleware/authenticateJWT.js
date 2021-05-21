// @flow
const admin = require('firebase-admin')

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const encodedToken = authHeader && authHeader.split(' ')[1]

  if (encodedToken == null) {
    req.firebaseToken = null // no token
    next()
  } else {
    admin
      .auth()
      .verifyIdToken(encodedToken)
      .then(decodedToken => {
        req.firebaseToken = decodedToken
        next()
      })
      .catch(err => {
        console.log('🚀 ~ file: authenticateJWT.js ~ line 21 ~ err', err)
        req.firebaseToken = null
        next()
      })
  }
}
