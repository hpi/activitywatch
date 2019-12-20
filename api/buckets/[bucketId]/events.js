const authCheck = require(`../../_lib/auth`)
const fetch = require(`node-fetch`)
const auth = require(`@qnzl/auth`)

const { CLAIMS } = auth

const awUrl = process.env.AW_URL

const buildQueryString = (query) => {
  const queryStrings = Object.keys(query).map((key) => {
    return `${key}=${query[key]}`
  })

  return queryStrings.join(`&`)
}

const handler = async (req, res, next) => {
  const { bucketId } = req.query

  try {
    const query = buildQueryString(req.query)

    const url = `${awUrl}/api/v1/get/${bucketId}?${query}`
    const response = await fetch(url, {
      headers: {
        Authorization: authorization
      }
    })

    const data = await response.json()

    return res.json(data)
  } catch (e) {
    return res.status(500).json({})
  }
}

module.exports = (req, res) => {
  return authClaim(CLAIMS.activityWatch.get)(req, res, handler)
}

