import fs from "fs/promises";
import path from "path";
import sizeOf from "image-size";
import { ISizeCalculationResult } from "image-size/dist/types/interface";
import { IMAGE_FORMATS } from "./standard-requirements";
const axios = require("axios");

export async function getImageDimensions(
  filePath: string
): Promise<ISizeCalculationResult | null> {
  const fileData = await fs.readFile(filePath);
  const contentType = path.extname(filePath).slice(1); // slice to remove the dot
  const isImage = IMAGE_FORMATS.includes(contentType);
  if (!isImage) {
    return null; // not an image
  }
  return sizeOf(fileData);
}
