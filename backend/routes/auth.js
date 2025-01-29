const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../db")

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await db.query("INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id", [
      username,
      hashedPassword,
      role,
    ])
    res.status(201).json({ message: "User registered successfully", userId: result.rows[0].id })
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username])
    const user = result.rows[0]

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })
      res.json({ message: "Login successful", token })
    } else {
      res.status(401).json({ message: "Invalid credentials" })
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message })
  }
})

module.exports = router

