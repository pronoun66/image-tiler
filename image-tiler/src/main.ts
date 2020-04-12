// @ts-nocheck
import Jimp from 'jimp';

const main = async () => {
  const outputImagePath = '../client/src/assets/images'

  try {
    const image = await Jimp.read('images/original.jpg');
    const {width, height} = image.bitmap;
    console.log('{width, height}', width, height)
    const tileSize = 256;

    const levelNumber = 1 + Math.ceil(Math.log2(Math.max(width, height)))
    for (let level = levelNumber - 1; level >= 0; level--) {

      const resolutionRatio = Math.pow(2, levelNumber - 1 - level);
      const resizedWidth = Math.ceil(width / resolutionRatio);
      const resizedHeight = Math.ceil(height / resolutionRatio);

      const numTileX = Math.ceil(resizedWidth / tileSize);
      const numTileY = Math.ceil(resizedHeight / tileSize);

      console.log('resizedWidth, resizedHeight', resizedWidth, resizedHeight);
      console.log('numTileRows, numTileColumns', numTileX, numTileY);
      const tileTotalWidth = numTileX * tileSize;
      const tileTotalHeight = numTileY * tileSize;

      const offsetWidth = Math.ceil((tileTotalWidth - resizedWidth) / 2);
      const offsetHeight = Math.ceil((tileTotalHeight - resizedHeight) / 2);
      console.log('offsetWidth, offsetHeight', offsetWidth, offsetHeight);
      const newImage = await new Jimp(tileTotalWidth, tileTotalHeight, '#FFFFFF');
      newImage.composite(image.resize(resizedWidth, resizedHeight), offsetWidth, offsetHeight)
      newImage.write(`${outputImagePath}/${level}/original.jpg`)

      for (let i = 0; i < numTileX; i++) {
        for (let j = 0; j < numTileY; j++) {
          newImage
            .clone()
            .crop(i * tileSize, j * tileSize, tileSize, tileSize)
            .write(`${outputImagePath}/${level}/${i}_${j}.jpg`)
        }
      }
    }

    return;
  } catch (e) {
    console.log('error', e);
  }

}

main();