const authCheck = require(`../_lib/auth`)
const auth = require(`@qnzl/auth`)
const fetch = require(`node-fetch`)

const { CLAIMS } = auth

const awUrl = process.env.AW_URL

const handler = async (req, res, next) => {
  const { authorization } = req.headers

  console.log("GET BUCKETS")
  const response = await fetch(`${awUrl}/api/v1/buckets`, {
    headers: {
      Authorization: authorization
    }
  })

  const body = await response.json()

  console.log("BODY!", body)
  return res.send(Object.values(body))
}

module.exports = (req, res) => {
  return authCheck(CLAIMS.activityWatch.get)(req, res, handler)
}

