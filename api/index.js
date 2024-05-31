const express = require("express")
const app = express()

const { closeGateway } = require("./gateway")
const { login, isSecure } = require("./auth")

require("dotenv").config({ path: __dirname + "/../.env" })

app.get("/gateway", async (req, res) => {
  if (!isSecure(req)) return res.status(401).send("Unauthorized")

  const session = await login()
  const action = req.query.action ?? "close"

  switch (action) {
    case "close":
      await closeGateway(session)
      res.send("Gateway is closed")
      break
    default:
      res.status(400).send("Invalid action")
  }
})

app.listen(3000, () => console.log("Server ready on port 3000"))

module.exports = app
