const auth = require(`@qnzl/auth`)

module.exports = (claim) => (req, res, next) => {
  const {
    authorization
  } = req.headers

  if (!authorization) {
    return res.status(401).send()
  }

  const isTokenValid = auth.checkJWT(authorization, claim, `watchers`, process.env.ISSUER)

  if (!isTokenValid) {
    return res.status(401).send()
  }

  return next(req, res)
}
