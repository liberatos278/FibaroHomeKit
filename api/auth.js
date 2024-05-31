const apiLoginUri = "https://id.cloud.fibaro.com/login"
const apiAuthUri =
  "https://id.cloud.fibaro.com/oauth/authorize?response_type=code&client_id=remote-access-v1&redirect_uri=https%3A%2F%2Fhome.fibaro.com%2Fcmh%2Fapi%2Fauthorize"
const apiSessionUri = "https://home.fibaro.com/cmh/api/session"
const accessTokenUri =
  "https://home.fibaro.com/fghcl/4.630/fibaro/cz/js/config.js.php"
const obtainAccessTokenUri =
  "https://home.fibaro.com/cmh/api/hc/go-to-hc-with-token?hc=<hc>&type=hcl&softwareVersion=4.630&isSoftwareBeta=false"

async function login() {
  const formData = new URLSearchParams()
  formData.append("username", process.env.EMAIL)
  formData.append("password", process.env.PASSWORD)

  const res = await fetch(apiLoginUri, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  })

  const sessionCookie = res.headers.get("set-cookie").split(";")[0]

  const authorizeRes = await fetch(apiAuthUri, {
    method: "GET",
    redirect: "manual",
    headers: {
      Cookie: sessionCookie,
    },
  })

  const locationCode = authorizeRes.headers.get("location")

  const codeAuthRes = await fetch(locationCode, {
    method: "GET",
    redirect: "manual",
    headers: {
      Cookie: sessionCookie,
    },
  })

  const phpSessionId = codeAuthRes.headers.get("set-cookie").split(";")[0]

  const sessionRes = await fetch(apiSessionUri, {
    method: "GET",
    headers: {
      Cookie: phpSessionId,
    },
  })

  const session = await sessionRes.json()

  // Obtain access token in source code
  await fetch(obtainAccessTokenUri.replace("<hc>", process.env.HC), {
    method: "GET",
    redirect: "manual",
    headers: {
      Cookie: phpSessionId,
    },
  })

  const accessTokenRes = await fetch(accessTokenUri, {
    method: "GET",
    redirect: "manual",
    headers: {
      Cookie: phpSessionId,
    },
  })

  const accessTokenScript = await accessTokenRes.text()

  // Get everything after "var installerTokenFromPHP = '"
  const accessTokenPart = accessTokenScript.split(
    "var installerTokenFromPHP = '"
  )[1]

  // End string with first occurence of "'"
  const accessTokenEnd = accessTokenPart.indexOf("'")
  const accessToken = accessTokenPart.slice(0, accessTokenEnd)

  if (!accessToken) throw new Error("Access token cannot be obtained")

  return {
    accessToken,
    user: session.user,
    email: session.email,
    temp: session.tempKey,
    hc: process.env.HC,
  }
}

module.exports = {
  login,
}
