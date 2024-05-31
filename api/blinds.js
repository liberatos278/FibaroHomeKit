const deviceId = 9
const apiUri =
  "https://home.fibaro.com/newProxyLite?user=<user>&hc=<hc>&temp=<temp>&req=<actionUri>"
const actionUri = "/api/devices/:deviceId/action/:action"

async function setSlats({ accessToken, temp, hc, user }, position) {
  const uri = apiUri
    .replace("<user>", user)
    .replace("<hc>", hc)
    .replace("<temp>", temp)
    .replace(
      "<actionUri>",
      actionUri.replace(":deviceId", deviceId).replace(":action", "setValue2")
    )

  const formData = new URLSearchParams()
  formData.append("args", "[50]")

  await fetch(uri, {
    method: "POST",
    headers: {
      "X-Fibaro-Auth": `RA-Access-Token ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `{"args":[${position}]}`,
  })
}

module.exports = {
  setSlats,
}
