import {
  getPlugins,
  get,
  getImageDimensions,
  StorePlugin,
  pluginStructure,
} from "./utils";
import { createHash } from "crypto";
import * as jsonschema from "jsonschema";
const AdmZip = require("adm-zip");

function areAllMandatoryFilesPresent(files: Array<string>) {
  const hasManifest = files.includes("manifest.json");

  if (!hasManifest) {
    console.log("Missing mandatory file: manifest.json");
    return false;
  }
  return true;
}

function calculateChecksumFromBuffer(buffer: Buffer): string {
  return createHash("md5").update(buffer).digest("hex");
}

function getFileListFromZip(zipBuffer: Buffer): string[] {
  const zip = new AdmZip(zipBuffer);
  const entries = zip.getEntries();
  return entries
    .filter((entry) => !entry.isDirectory)
    .map((entry) => entry.name);
}

function getManifestFromZip(zipBuffer: Buffer): any {
  const zip = new AdmZip(zipBuffer);
  const entries = zip.getEntries();
  const manifest = entries.find(
    (entry: { name: string }) => entry.name === "manifest.json"
  );
  return JSON.parse(zip.readAsText(manifest));
}

async function checkPluginZips(plugin: StorePlugin) {
  console.log(`Checking plugin ${plugin.name}`);
  for (let os in plugin.assets) {
    const asset = plugin.assets[os];
    let { url: assetUrl, checksum } = asset;

    // Download zip file only once
    const zipBuffer = await get(assetUrl);

    // Validate checksum
    const calculatedChecksum = calculateChecksumFromBuffer(zipBuffer);
    if (calculatedChecksum !== checksum) {
      throw new Error("Invalid asset checksum");
    }

    // Get file list from zip
    const files = getFileListFromZip(zipBuffer);
    const filesAreValid = areAllMandatoryFilesPresent(files);
    if (!filesAreValid) {
      throw new Error(`Missing mandatory files in zip for ${os}`);
    }

    // Validate manifest structure
    try {
      const manifest = getManifestFromZip(zipBuffer);
      const manifestIsValid =
        jsonschema.validate(manifest, pluginStructure).errors.length === 0;
      if (!manifestIsValid) {
        throw new Error("Invalid manifest");
      }
    } catch (error) {
      throw new Error("Invalid manifest");
    }
  }
}
export async function validateList() {
  const plugins = await getPlugins();

  // check if all plugins have a different name
  const setPluginName = new Set(plugins.map((plugin) => plugin.name));
  const allPluginsHaveDifferentNames = setPluginName.size == plugins.length;

  if (!allPluginsHaveDifferentNames) {
    throw new Error("Error: Plugin name is duplicated");
  }

  plugins.forEach(async (changedPlugin) => {
    const logo = changedPlugin.getLogoPath();
    const url = changedPlugin.url;

    const isUrlValid: boolean = /^https?:\/\/.+$/.test(url);

    if (!isUrlValid) {
      throw new Error("Invalid url");
    }

    const dimLogo = await getImageDimensions(logo);

    if (dimLogo == null) {
      throw new Error(
        "Couldn't get logo dimensions - check if the url is correct"
      );
    }

    const isLogoSquare = dimLogo!.width! == dimLogo!.height!;
    const isLogoSmallerThan40px = dimLogo!.width! < 40;

    if (!isLogoSquare && !isLogoSmallerThan40px) {
      throw new Error("Logo width should be a square smaller than 40px");
    }

    await checkPluginZips(changedPlugin);
  });
}

validateList();
