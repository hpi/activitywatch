const authCheck = require(`../../_lib/auth`)
const auth = require(`@qnzl/auth`)
const fetch = require(`node-fetch`)

const { CLAIMS } = auth

const awUrl = process.env.AW_URL

const productiveUrls = [
  `localhost`,
  `momentjs.com`,
  `developer.exist.io`,
  `exist.io`,
  `qnzl.co`,
  `phoneprivacy.qnzl.co`,
  `todoist.com`,
  `duckduckgo.com`,
  `nodejs.org`,
  `ally.com`,
  `www.ally.com`
]

const neutralUrls = [
  `www.fastmail.com`,
  `fastmail.com`,
  `medium.com`,
]

const gamingUrls = []
const tvUrls = [
  `youtube.com`,
  `www.youtube.com`
]

const handler = async (req, res, next) => {
  const { url } = req.query

  let classification

  // It is easier to declare everything that *isn't* unproductive then fighting
  // an unending war of classifying everything that is
  if (productiveUrls.includes(url)) {
    classification = `productive`
  } else if (neutralUrls.includes(url)) {
    classification = `neutral`
  } else if (gamingUrls.includes(url)) {
    classification = `gaming`
  } else if (tvUrls.includes(url)) {
    classification = `tv`
  } else {
    classification = `distracting`
  }

  return res.json({ classification })
}

module.exports = (req, res) => {
  return authClaim(CLAIMS.activityWatch.get)(req, res, handler)
}
