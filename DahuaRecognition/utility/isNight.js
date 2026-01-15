const { Jimp } = require("jimp")

async function evaluateBrightness(imageBuffer) {
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

module.exports = { evaluateBrightness }
