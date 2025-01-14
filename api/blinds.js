const defaultDeviceId = 9
const apiUri =
  "https://home.fibaro.com/newProxyLite?user=<user>&hc=<hc>&temp=<temp>&req=<actionUri>"
const actionUri = "/api/devices/:deviceId/action/:action"

async function setBlindsLevel(
  { accessToken, temp, hc, user },
  level,
  deviceId
) {
  const uri = apiUri
    .replace("<user>", user)
    .replace("<hc>", hc)
    .replace("<temp>", temp)
    .replace(
      "<actionUri>",
      actionUri
        .replace(
          ":deviceId",
          deviceId === undefined ? defaultDeviceId : deviceId
        )
        .replace(":action", "setValue2")
    )

  await fetch(uri, {
    method: "POST",
    headers: {
      "X-Fibaro-Auth": `RA-Access-Token ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `{"args":[${level}]}`,
  })
}

async function getBlindsLevel({ accessToken, temp, hc, user }, deviceId) {
  const uri = apiUri
    .replace("<user>", user)
    .replace("<hc>", hc)
    .replace("<temp>", temp)
    .replace("<actionUri>", `/api/interface/data`)

  const res = await fetch(uri, {
    method: "GET",
    headers: {
      "X-Fibaro-Auth": `RA-Access-Token ${accessToken}`,
    },
  })
  const data = await res.json()
  const device = data.devices.find((device) => device.id === Number(deviceId))

  return device.properties.value2 == 0
    ? 0
    : Number(device.properties.value2) + 1
}

async function setBlindsPosition(
  { accessToken, temp, hc, user },
  position,
  deviceId
) {
  const uri = apiUri
    .replace("<user>", user)
    .replace("<hc>", hc)
    .replace("<temp>", temp)
    .replace(
      "<actionUri>",
      actionUri
        .replace(
          ":deviceId",
          deviceId === undefined ? defaultDeviceId : deviceId
        )
        .replace(":action", "setValue")
    )

  await fetch(uri, {
    method: "POST",
    headers: {
      "X-Fibaro-Auth": `RA-Access-Token ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `{"args":[${position}]}`,
  })
}

async function getBlindsPosition({ accessToken, temp, hc, user }, deviceId) {
  const uri = apiUri
    .replace("<user>", user)
    .replace("<hc>", hc)
    .replace("<temp>", temp)
    .replace("<actionUri>", `/api/interface/data`)

  const res = await fetch(uri, {
    method: "GET",
    headers: {
      "X-Fibaro-Auth": `RA-Access-Token ${accessToken}`,
    },
  })
  const data = await res.json()
  const device = data.devices.find((device) => device.id === Number(deviceId))

  return device.properties.value2 == 0 ? 0 : Number(device.properties.value) + 1
}

module.exports = {
  setBlindsLevel,
  getBlindsLevel,
  setBlindsPosition,
  getBlindsPosition,
}
