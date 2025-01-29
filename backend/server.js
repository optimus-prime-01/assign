require("dotenv").config()
const express = require("express")
const app = express()
const authRoutes = require("./routes/auth")
const trainRoutes = require("./routes/trains")
const bookingRoutes = require("./routes/bookings")

app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/trains", trainRoutes)
app.use("/api/bookings", bookingRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

