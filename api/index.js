const express = require("express")
const app = express()

const { setSlats } = require("./blinds")
const { login, isSecure } = require("./auth")

require("dotenv").config({ path: __dirname + "/../.env" })

app.get("/blinds-level", async (req, res) => {
  if (!isSecure(req)) return res.status(401).send("Unauthorized")

  const session = await login()
  const action = req.query.action ?? "close"

  switch (action) {
    case "open":
      await setSlats(session, 100)
      res.send("Blinds level set to 100%")
      break
    case "close":
      await setSlats(session, 0)
      res.send("Blinds level set to 0%")
      break
    case "custom":
      let position = Number(req.query.position)

      if (!position || isNaN(position))
        return res.status(400).send("Position is required")
      if (position > 100) position = 100
      if (position < 0) position = 0

      await setSlats(session, position)
      res.send(`Blinds level set to ${position}%`)
      break
    default:
      res.status(400).send("Invalid action")
  }
})

app.listen(3000, () => console.log("Server ready on port 3000"))

module.exports = app
