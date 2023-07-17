import {
  getPlugins,
  IMAGE_FORMATS,
  checkFileChecksum,
  getZipFileList,
  getImageDimensions,
  StorePlugin,
} from "./utils";

const patterns = {
  windows: /^[a-zA-Z0-9]+\.exe$/,
  linux: /^[a-zA-Z0-9]+$/,
  "macos-amd64": /^[a-zA-Z0-9]+$/,
  "macos-arm64": /^[a-zA-Z0-9]+$/
};
function areAllFilesInZipValid(files: Array<string>, pattern: RegExp) {
  return files.every(
    // all files must be either a binary either a manifest either an image
    (file) =>
      (!!file.match(pattern) !== // file is a binary
        IMAGE_FORMATS.some((format) => file.endsWith(`.${format}`))) !== // file is an image
      (file === "manifest.json") // file is a manifest
  );
}
async function checkPluginZips(plugin: StorePlugin) {
  for (let assetName in plugin.assets) {
    const asset = plugin.assets[assetName];
    let { url: assetUrl, checksum } = asset;
    let files = await getZipFileList(assetUrl);
    const filesAreValid = areAllFilesInZipValid(files, patterns[assetName]);

    if (!filesAreValid) {
      throw new Error(`Invalid files in zip for ${assetName}`);
    }

    let checksumIsValid = await checkFileChecksum(assetUrl, checksum);

    if (!checksumIsValid) {
      throw new Error("Invalid asset checksum");
    }

    let manifestIsValid =
      await plugin.isPluginManifestInAssetFollowingStructure(assetUrl);

    if (!manifestIsValid) {
      throw new Error("Invalid manifest");
    }
  }
}
export async function validateList() {
  const { changedPlugins } = await getPlugins();
  // check if all plugins have a different name
  const setPluginName = new Set(changedPlugins.map((plugin) => plugin.name));
  const allPluginsHaveDifferentNames =
    setPluginName.size == changedPlugins.length;

  if (!allPluginsHaveDifferentNames) {
    throw new Error("Error: Plugin name is duplicated");
  }

  changedPlugins.forEach(async (changedPlugin) => {
    const logo = changedPlugin.getLogoPath();
    const url = changedPlugin.url;

    const isUrlValid = !!url.match(
      /^(https?:\/\/)[a-zA-Z0-9]+$/
    );

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
