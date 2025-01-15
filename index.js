const express = require("express")
const app = express()

require("dotenv").config({ path: __dirname + "/.env" })

app.get("/set-blinds-level", async (req, res) => {
  await fetch(
    `http://${process.env.IP}/api/devices/${req.query.deviceId}/action/setValue2`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.TOKEN}`,
      },
      body: `{"args":[${req.query.level}]}`,
    }
  )

  res.json({ level: Number(req.query.level) })
})

app.get("/get-blinds-level", async (req, res) => {
  const result = await fetch(
    `http://${process.env.IP}/api/devices/${req.query.deviceId}/properties/value2`,
    {
      headers: {
        Authorization: `Basic ${process.env.TOKEN}`,
      },
    }
  )

  const data = await result.json()

  if (data.value) data.value = data.value == 0 ? 0 : Number(data.value) + 1
  res.json(data)
})

app.get("/set-blinds-position", async (req, res) => {
  await fetch(
    `http://${process.env.IP}/api/devices/${req.query.deviceId}/action/setValue`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.TOKEN}`,
      },
      body: `{"args":[${req.query.position}]}`,
    }
  )

  res.json({ position: Number(req.query.position) })
})

app.get("/get-blinds-position", async (req, res) => {
  const result = await fetch(
    `http://${process.env.IP}/api/devices/${req.query.deviceId}/properties/value`,
    {
      headers: {
        Authorization: `Basic ${process.env.TOKEN}`,
      },
    }
  )

  const data = await result.json()

  if (data.value) data.value = data.value == 0 ? 0 : Number(data.value) + 1
  res.json(data)
})

app.get("/turnOn", async (req, res) => {
  await fetch(
    `http://${process.env.IP}/api/devices/${req.query.deviceId}/action/turnOn`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.TOKEN}`,
      },
    }
  )

  res.json({})
})

app.get("/turnOff", async (req, res) => {
  await fetch(
    `http://${process.env.IP}/api/devices/${req.query.deviceId}/action/turnOff`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.TOKEN}`,
      },
    }
  )

  res.json({})
})

app.get("/get-state", async (req, res) => {
  const result = await fetch(
    `http://${process.env.IP}/api/devices/${req.query.deviceId}/properties/value`,
    {
      headers: {
        Authorization: `Basic ${process.env.TOKEN}`,
      },
    }
  )

  const data = await result.json()
  res.json(data)
})

app.listen(3127, () => console.log("Server ready on port 3127"))

module.exports = app
