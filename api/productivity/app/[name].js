const authCheck = require(`../../_lib/auth`)
const auth = require(`@qnzl/auth`)
const fetch = require(`node-fetch`)

const { CLAIMS } = auth

const awUrl = process.env.AW_URL

const productiveApps = [
  `st-256color`,
  `Insomnia`
]

const distractingApps = []
const gamingApps = []

const handler = async (req, res, next) => {
  const { name } = req.query

  let classification

  if (productiveApps.includes(name)) {
    classification = `productive`
  } else if (distractingApps.includes(name)) {
    classification = `distracting`
  } else if (gamingApps.includes(name)) {
    classification = `gaming`
  } else {
    classification = `neutral`
  }

  return res.json({ classification })
}

module.exports = (req, res) => {
  return authCheck(CLAIMS.activityWatch.get)(req, res, handler)
}

