const express = require("express")
const router = express.Router()
const db = require("../db")
const { authenticateToken, isAdmin, checkApiKey } = require("../middleware/auth")

router.post("/", authenticateToken, isAdmin, checkApiKey, async (req, res) => {
  try {
    const { name, source, destination, total_seats } = req.body
    const result = await db.query(
      "INSERT INTO trains (name, source, destination, total_seats) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, source, destination, total_seats],
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: "Error adding train", error: error.message })
  }
})

router.get("/availability", async (req, res) => {
  try {
    const { source, destination } = req.query
    const result = await db.query(
      `SELECT t.*, (t.total_seats - COALESCE(b.booked_seats, 0)) AS available_seats
       FROM trains t
       LEFT JOIN (
         SELECT train_id, COUNT(*) AS booked_seats
         FROM bookings
         GROUP BY train_id
       ) b ON t.id = b.train_id
       WHERE t.source = $1 AND t.destination = $2`,
      [source, destination],
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: "Error fetching train availability", error: error.message })
  }
})

module.exports = router

