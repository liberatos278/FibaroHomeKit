const express = require("express")
const app = express()

const { setBlindsLevel, setBlindsPosition } = require("./blinds")
const { login, isSecure } = require("./auth")

require("dotenv").config({ path: __dirname + "/../.env" })

app.get("/blinds-level", async (req, res) => {
  if (!isSecure(req)) return res.status(401).send("Unauthorized")

  const session = await login()
  const action = req.query.action ?? "close"

  switch (action) {
    case "open":
      await setBlindsLevel(session, 100)
      res.send("Blinds level set to 100%")
      break
    case "close":
      await setBlindsLevel(session, 0)
      res.send("Blinds level set to 0%")
      break
    case "custom":
      let level = Number(req.query.level)

      if (isNaN(level)) return res.status(400).send("Level is required")
      if (level > 100) level = 100
      if (level < 0) level = 0

      await setBlindsLevel(session, level)
      res.send(`Blinds level set to ${level}%`)
      break
    default:
      res.status(400).send("Invalid action")
  }
})

app.get("/blinds-position", async (req, res) => {
  if (!isSecure(req)) return res.status(401).send("Unauthorized")

  const session = await login()
  const action = req.query.action ?? "up"

  switch (action) {
    case "up":
      await setBlindsPosition(session, 100)
      res.send("Blinds position set to 100%")
      break
    case "down":
      await setBlindsPosition(session, 0)
      res.send("Blinds position set to 0%")
      break
    case "custom":
      let position = Number(req.query.position)

      if (isNaN(position)) return res.status(400).send("Position is required")
      if (position > 100) position = 100
      if (position < 0) position = 0

      await setBlindsPosition(session, position)
      res.send(`Blinds position set to ${position}%`)
      break
    default:
      res.status(400).send("Invalid action")
  }
})

app.listen(3000, () => console.log("Server ready on port 3000"))

module.exports = app
