const express = require("express")
const app = express()

const {
  setBlindsLevel,
  setBlindsPosition,
  getBlindsLevel,
  getBlindsPosition,
} = require("./blinds")
const { setPoolLight } = require("./lights")
const { callGate } = require("./gate")
const { login, isSecure } = require("./auth")

require("dotenv").config({ path: __dirname + "/../.env" })

app.get("/blinds-level", async (req, res) => {
  if (!isSecure(req)) return res.status(401).send("Unauthorized")

  const session = await login()
  const action = req.query.action ?? "close"

  switch (action) {
    case "open":
      await setBlindsLevel(session, 99, req.query.deviceId)
      res.send("Blinds level set to 100%")
      break
    case "close":
      await setBlindsLevel(session, 0, req.query.deviceId)
      res.send("Blinds level set to 1%")
      break
    case "custom":
      let level = Number(req.query.level)

      if (isNaN(level)) return res.status(400).send("Level is required")
      if (level > 99) level = 99
      if (level < 0) level = 0

      await setBlindsLevel(session, level, req.query.deviceId)
      res.send(`Blinds level set to ${level + 1}%`)
      break
    default:
      res.status(400).send("Invalid action")
  }
})

app.get("/blinds-level-get", async (req, res) => {
  if (!isSecure(req)) return res.status(401).send("Unauthorized")

  const session = await login()
  const level = await getBlindsLevel(session, req.query.deviceId)
  res.json({ level })
})

app.get("/blinds-position-get", async (req, res) => {
  if (!isSecure(req)) return res.status(401).send("Unauthorized")

  const session = await login()
  const position = await getBlindsPosition(session, req.query.deviceId)
  res.json({ position })
})

app.get("/blinds-position", async (req, res) => {
  if (!isSecure(req)) return res.status(401).send("Unauthorized")

  const session = await login()
  const action = req.query.action ?? "up"

  switch (action) {
    case "up":
      await setBlindsPosition(session, 99, req.query.deviceId)
      res.send("Blinds position set to 100%")
      break
    case "down":
      await setBlindsPosition(session, 0, req.query.deviceId)
      res.send("Blinds position set to 1%")
      break
    case "custom":
      let position = Number(req.query.position)

      if (isNaN(position)) return res.status(400).send("Position is required")
      if (position > 99) position = 99
      if (position < 0) position = 0

      await setBlindsPosition(session, position, req.query.deviceId)
      res.send(`Blinds position set to ${position + 1}%`)
      break
    default:
      res.status(400).send("Invalid action")
  }
})

app.get("/pool-light", async (req, res) => {
  if (!isSecure(req)) return res.status(401).send("Unauthorized")

  const session = await login()
  const action = req.query.action ?? "turnOn"

  switch (action) {
    case "turnOn":
      await setPoolLight(session, action)
      res.send("Pool light turned on")
      break
    case "turnOff":
      await setPoolLight(session, action)
      res.send("Pool light turned off")
      break
    default:
      res.status(400).send("Invalid action")
  }
})

app.get("/gate", async (req, res) => {
  if (!isSecure(req)) return res.status(401).send("Unauthorized")

  const session = await login()

  await callGate(session)
  res.send(`Gate called successfully`)
})

app.listen(3000, () => console.log("Server ready on port 3000"))

module.exports = app
