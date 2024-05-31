const deviceId = 19
const apiUri =
  "https://home.fibaro.com/newProxyLite?user=<user>&hc=<hc>&temp=<temp>&req=<actionUri>"
const actionUri = "/api/devices/:deviceId/action/:action"

async function callGate({ accessToken, temp, hc, user }) {
  const uri = apiUri
    .replace("<user>", user)
    .replace("<hc>", hc)
    .replace("<temp>", temp)
    .replace(
      "<actionUri>",
      actionUri.replace(":deviceId", deviceId).replace(":action", "turnOn")
    )

  await fetch(uri, {
    method: "POST",
    headers: {
      "X-Fibaro-Auth": `RA-Access-Token ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
}

module.exports = {
  callGate,
}
