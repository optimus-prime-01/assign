const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." })
  }
  next()
}

const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"]
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ message: "Invalid API key" })
  }
  next()
}

module.exports = { authenticateToken, isAdmin, checkApiKey }

