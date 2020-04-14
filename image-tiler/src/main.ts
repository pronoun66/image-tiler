import Jimp from "jimp";

export const TILE_SIZE = 256;
export const TOLERABLE_CROP_SIZE = 50;
export const EXTENDED_IMAGE_BACKGROUND_COLOUR = "#FFFFFF";
export const OUTPUT_IMAGE_PATH = "../ui/src/assets/images";
export const INPUT_IMAGE_PATH = "images/original.jpg";

export default async (): Promise<void> => {
  try {
    console.log("====== Image tiler started ======");
    const image = await Jimp.read(INPUT_IMAGE_PATH);
    const width = image.getWidth();
    const height = image.getHeight();
    console.log("image size: width, height", width, height);

    const levelNumber = 1 + Math.ceil(Math.log2(Math.max(width, height)));

    for (let level = levelNumber - 1; level >= 0; level--) {
      const compressionRatio = Math.pow(2, levelNumber - 1 - level);
      const resizedWidth = Math.ceil(width / compressionRatio);
      const resizedHeight = Math.ceil(height / compressionRatio);

      const numTileX = getNumTile(resizedWidth);
      const numTileY = getNumTile(resizedHeight);

      const tileTotalWidth = numTileX * TILE_SIZE;
      const tileTotalHeight = numTileY * TILE_SIZE;

      console.log("level", level);
      console.log("resizedWidth, resizedHeight", resizedWidth, resizedHeight);
      console.log("tileTotalWidth, tileTotalHeight", tileTotalWidth, tileTotalHeight);
      console.log("numTileRows, numTileColumns", numTileX, numTileY);

      const newImage = await tileImage(image, resizedWidth, resizedHeight, tileTotalWidth, tileTotalHeight);

      await writeTiles(newImage, level, numTileX, numTileY);
      console.log("======  Image tiler ended ======");
    }
  } catch (e) {
    console.log("error", e);
  }
};

export const getNumTile = (length: number): number => {
  const remaining = length % TILE_SIZE;
  return remaining > TOLERABLE_CROP_SIZE ? Math.ceil(length / TILE_SIZE) : Math.max(Math.floor(length / TILE_SIZE), 1);
};

export const tileImage = async (image: any, resizedWidth: number, resizedHeight: number, tileTotalWidth: number, tileTotalHeight: number) => {
  const offsetWidth = Math.ceil((resizedWidth - tileTotalWidth) / 2);
  const offsetHeight = Math.ceil((resizedHeight - tileTotalHeight) / 2);

  let newImage;
  if (offsetWidth > 0 && offsetHeight > 0) {
    newImage = image.crop(offsetWidth, offsetHeight, tileTotalWidth, tileTotalHeight).clone();
  } else if (offsetWidth > 0 && offsetHeight < 0) {
    newImage = (await new Jimp(resizedWidth, tileTotalHeight, EXTENDED_IMAGE_BACKGROUND_COLOUR))
      .composite(image.resize(resizedWidth, resizedHeight), 0, -offsetHeight)
      .crop(offsetWidth, 0, tileTotalWidth, tileTotalHeight);
  } else if (offsetWidth < 0 && offsetHeight > 0) {
    newImage = (await new Jimp(tileTotalWidth, resizedHeight, EXTENDED_IMAGE_BACKGROUND_COLOUR))
      .composite(image.resize(resizedWidth, resizedHeight), -offsetWidth, 0)
      .crop(0, offsetHeight, tileTotalWidth, tileTotalHeight);
  } else {
    newImage = await new Jimp(tileTotalWidth, tileTotalHeight, EXTENDED_IMAGE_BACKGROUND_COLOUR);
    newImage.composite(image.resize(resizedWidth, resizedHeight), -offsetWidth, -offsetHeight);
  }
  return newImage;
};

export const writeTiles = async (image: any, level: number, numTileX: number, numTileY: number) => {
  for (let i = 0; i < numTileX; i++) {
    for (let j = 0; j < numTileY; j++) {
      await image
        .clone()
        .crop(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        .write(`${OUTPUT_IMAGE_PATH}/${level}/${i}_${j}.jpg`);
    }
  }
};