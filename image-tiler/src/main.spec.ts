import Jimp from "jimp";
import { getNumTile, TILE_SIZE, TOLERABLE_CROP_SIZE, tileImage, writeTiles } from "./main";

describe("getNumTile", () => {
  it("tile number should increase 1 when difference is more then TOLERABLE_CROP_SIZE", ()=> {
    const length = TILE_SIZE + TOLERABLE_CROP_SIZE + 1;
    expect(getNumTile(length)).toBe(2);
  });

  it("tile number should remain the same when difference is under or equal to TOLERABLE_CROP_SIZE", () => {
    const length = TILE_SIZE + TOLERABLE_CROP_SIZE;
    expect(getNumTile(length)).toBe(1);
  });

  it("tile number should be 1 when length is less than TILE_SIZE", () => {
    const length = 1;
    expect(getNumTile(length)).toBe(1);
  });
});

// TODO should check image extension or crop
describe("tileImage", () => {
  let width = 256;
  let height = 256;
  const tileTotalWidth = 256;
  const tileTotalHeight = 256;
  const imageColour = "#000000";

  it("when image's width and height is longer than tile total width and height", async () => {
    width = tileTotalWidth + 1;
    height = tileTotalHeight + 1;
    const image = new Jimp(width, height, imageColour);
    const newImage = await tileImage(image, width, height, tileTotalWidth, tileTotalHeight);

    expect((newImage as any).getWidth()).toBe(tileTotalWidth);
    expect((newImage as any).getHeight()).toBe(tileTotalHeight);
  });

  it("when image's width is longer than tile total width but height is shorter than tile total height", async () => {
    width = tileTotalWidth + 1;
    height = tileTotalHeight - 1;
    const image = new Jimp(width, height, imageColour);
    const newImage = await tileImage(image, width, height, tileTotalWidth, tileTotalHeight);

    expect((newImage as any).getWidth()).toBe(tileTotalWidth);
    expect((newImage as any).getHeight()).toBe(tileTotalHeight);
  });

  it("when image's height is longer than tile total height but width is shorter than title total width", async () => {
    width = tileTotalWidth - 1;
    height = tileTotalHeight + 1;
    const image = new Jimp(width, height, imageColour);
    const newImage = await tileImage(image, width, height, tileTotalWidth, tileTotalHeight);

    expect((newImage as any).getWidth()).toBe(tileTotalWidth);
    expect((newImage as any).getHeight()).toBe(tileTotalHeight);
  });

  it("when image's width and height is shorter than tile total width and height", async () => {
    width = tileTotalWidth - 1;
    height = tileTotalHeight - 1;
    const image = new Jimp(width, height, imageColour);
    const newImage = await tileImage(image, width, height, tileTotalWidth, tileTotalHeight);

    expect((newImage as any).getWidth()).toBe(tileTotalWidth);
    expect((newImage as any).getHeight()).toBe(tileTotalHeight);
  });
});

describe("writeTiles",() => {
  const level = 0;
  const numTileX = 3;
  const numTileY = 4;
  const imageColour = "#000000";
  const image = new Jimp(numTileX * TILE_SIZE, numTileY * TILE_SIZE, imageColour);
  const croppedImage = new Jimp(TILE_SIZE, TILE_SIZE, imageColour);
  jest.spyOn(image, "clone").mockReturnValue(image);
  jest.spyOn(image, "crop").mockReturnValue(croppedImage);
  const writeSpy = jest.spyOn(croppedImage, "write").mockImplementation(() => croppedImage);

  it("should create numTileX * numTileY tile images", async () => {
    await writeTiles(image, level, numTileX, numTileY);
    expect(writeSpy).toHaveBeenCalledTimes(numTileX * numTileY);
    expect(writeSpy).toHaveBeenLastCalledWith(expect.stringMatching(new RegExp(`${level}/${numTileX - 1}_${numTileY -1}`, "g")));
  });
});
