const deviceId = 48
const apiUri =
  "https://home.fibaro.com/newProxyLite?user=<user>&hc=<hc>&temp=<temp>&req=<actionUri>"
const actionUri = "/api/devices/:deviceId/action/:action"

async function setPoolLigth({ accessToken, temp, hc, user }, isOn) {
  const uri = apiUri
    .replace("<user>", user)
    .replace("<hc>", hc)
    .replace("<temp>", temp)
    .replace(
      "<actionUri>",
      actionUri
        .replace(":deviceId", deviceId)
        .replace(":action", isOn ? "turnOn" : "turnOff")
    )

  await fetch(uri, {
    method: "POST",
    headers: {
      "X-Fibaro-Auth": `RA-Access-Token ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
}
