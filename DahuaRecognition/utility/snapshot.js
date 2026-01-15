const axios = require("axios")
const crypto = require("crypto")

async function getImage() {
  const response1 = await axios.get(process.env.CAMERA_URL, {
    validateStatus: false,
  })
  if (response1.status !== 401 || !response1.headers["www-authenticate"]) {
    return res
      .status(500)
      .json({ error: "Nepodařilo se získat WWW-Authenticate hlavičku." })
  }

  const authHeader = response1.headers["www-authenticate"]
  const authParams = parseDigestHeader(authHeader)

  const ha1 = crypto
    .createHash("md5")
    .update(
      `${process.env.USERNAME}:${authParams.realm}:${process.env.PASSWORD}`
    )
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

  const authorization = `Digest username="${process.env.USERNAME}", realm="${authParams.realm}", nonce="${authParams.nonce}", uri="${authParams.uri}", response="${responseHash}", qop=${authParams.qop}, nc=00000001, cnonce="abcdef"`

  const response2 = await axios.get(process.env.CAMERA_URL, {
    headers: {
      Authorization: authorization,
    },
    responseType: "arraybuffer",
  })

  return response2.data
}

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

module.exports = { getImage, parseDigestHeader }
