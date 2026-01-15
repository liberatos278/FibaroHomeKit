const express = require("express")
const axios = require("axios")
const crypto = require("crypto")
const { Jimp } = require("jimp")

const app = express()
const PORT = 3128

const CAMERA_URL =
  "http://192.168.1.51/cgi-bin/snapshot.cgi?channel=1&subtype=0"
const USERNAME = "admin"
const PASSWORD = "KameryCirkvice2024"

app.get("/isNight", async (req, res) => {
  try {
    const response1 = await axios.get(CAMERA_URL, { validateStatus: false })
    if (response1.status !== 401 || !response1.headers["www-authenticate"]) {
      return res
        .status(500)
        .json({ error: "Nepodařilo se získat WWW-Authenticate hlavičku." })
    }

    const authHeader = response1.headers["www-authenticate"]
    const authParams = parseDigestHeader(authHeader)

    const ha1 = crypto
      .createHash("md5")
      .update(`${USERNAME}:${authParams.realm}:${PASSWORD}`)
      .digest("hex")

    const ha2 = crypto
      .createHash("md5")
      .update(`GET:${authParams.uri}`)
      .digest("hex")

    const responseHash = crypto
      .createHash("md5")
      .update(
        `${ha1}:${authParams.nonce}:00000001:abcdef:${authParams.qop}:${ha2}`
      )
      .digest("hex")

    const authorization = `Digest username="${USERNAME}", realm="${authParams.realm}", nonce="${authParams.nonce}", uri="${authParams.uri}", response="${responseHash}", qop=${authParams.qop}, nc=00000001, cnonce="abcdef"`

    const response2 = await axios.get(CAMERA_URL, {
      headers: {
        Authorization: authorization,
      },
      responseType: "arraybuffer",
    })

    const temperature = await calculateLightLevel(response2.data)

    res.json({
      temperature,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

function parseDigestHeader(header) {
  const authParams = {}
  const regex = /(\w+)="([^"]*)"/g
  let match

  while ((match = regex.exec(header))) {
    authParams[match[1]] = match[2]
  }

  authParams.uri = "/cgi-bin/snapshot.cgi?channel=1&subtype=0"
  authParams.qop = "auth"
  return authParams
}

app.get("/setCodec", async (req, res) => {
  try {
    const SETTINGS_URI =
      "http://192.168.1.51/cgi-bin/configManager.cgi?action=setConfig&Encode[0].MainFormat[0].Video.Compression=H.264B&Encode[0].MainFormat[0].Video.FPS=25&Encode[0].MainFormat[0].Video.Quality=4&Encode[0].MainFormat[0].Video.BitRateControl=VBR&Encode[0].MainFormat[0].Video.Width=1920&Encode[0].MainFormat[0].Video.Height=1080"

    const response1 = await axios.get(SETTINGS_URI, { validateStatus: false })
    if (response1.status !== 401 || !response1.headers["www-authenticate"]) {
      return res
        .status(500)
        .json({ error: "Nepodařilo se získat WWW-Authenticate hlavičku." })
    }

    const authHeader = response1.headers["www-authenticate"]
    const authParams = parseDigestHeader(authHeader)
    authParams.uri =
      "/cgi-bin/configManager.cgi?action=setConfig&Encode[0].MainFormat[0].Video.Compression=H.264B&Encode[0].MainFormat[0].Video.FPS=25&Encode[0].MainFormat[0].Video.Quality=4&Encode[0].MainFormat[0].Video.BitRateControl=VBR&Encode[0].MainFormat[0].Video.Width=1920&Encode[0].MainFormat[0].Video.Height=1080"

    const ha1 = crypto
      .createHash("md5")
      .update(`${USERNAME}:${authParams.realm}:${PASSWORD}`)
      .digest("hex")

    const ha2 = crypto
      .createHash("md5")
      .update(`GET:${authParams.uri}`)
      .digest("hex")

    const responseHash = crypto
      .createHash("md5")
      .update(
        `${ha1}:${authParams.nonce}:00000001:abcdef:${authParams.qop}:${ha2}`
      )
      .digest("hex")

    const authorization = `Digest username="${USERNAME}", realm="${authParams.realm}", nonce="${authParams.nonce}", uri="${authParams.uri}", response="${responseHash}", qop=${authParams.qop}, nc=00000001, cnonce="abcdef"`

    await axios.get(SETTINGS_URI, {
      headers: {
        Authorization: authorization,
      },
    })

    res.status(200).end()
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

async function calculateLightLevel(imageBuffer) {
  try {
    const image = await Jimp.read(imageBuffer)
    let isGrayscale = 1

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      const red = image.bitmap.data[idx]
      const green = image.bitmap.data[idx + 1]
      const blue = image.bitmap.data[idx + 2]

      if (red !== green || green !== blue) {
        isGrayscale = 0
      }
    })

    return isGrayscale
  } catch (error) {
    throw new Error("Nepodařilo se vypočítat úroveň světla.")
  }
}

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`)
})
