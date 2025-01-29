const express = require("express")
const router = express.Router()
const db = require("../db")
const { authenticateToken } = require("../middleware/auth")

router.post("/", authenticateToken, async (req, res) => {
  const client = await db.pool.connect()
  try {
    await client.query("BEGIN")
    const { train_id } = req.body
    const user_id = req.user.userId

    // Check seat availability
    const availabilityResult = await client.query(
      `SELECT (t.total_seats - COALESCE(b.booked_seats, 0)) AS available_seats
       FROM trains t
       LEFT JOIN (
         SELECT train_id, COUNT(*) AS booked_seats
         FROM bookings
         GROUP BY train_id
       ) b ON t.id = b.train_id
       WHERE t.id = $1
       FOR UPDATE`,
      [train_id],
    )

    if (availabilityResult.rows[0].available_seats <= 0) {
      await client.query("ROLLBACK")
      return res.status(400).json({ message: "No seats available" })
    }

    // Book the seat
    const bookingResult = await client.query(
      "INSERT INTO bookings (user_id, train_id, seat_number) VALUES ($1, $2, $3) RETURNING *",
      [user_id, train_id, availabilityResult.rows[0].available_seats],
    )

    await client.query("COMMIT")
    res.status(201).json(bookingResult.rows[0])
  } catch (error) {
    await client.query("ROLLBACK")
    res.status(500).json({ message: "Error booking seat", error: error.message })
  } finally {
    client.release()
  }
})

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user.userId
    const result = await db.query(
      `SELECT b.*, t.name AS train_name, t.source, t.destination
       FROM bookings b
       JOIN trains t ON b.train_id = t.id
       WHERE b.id = $1 AND b.user_id = $2`,
      [id, user_id],
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking details", error: error.message })
  }
})

module.exports = router

