import {
  getPlugins,
  IMAGE_FORMATS,
  checkFileChecksum,
  getZipFileList,
  getImageDimensions,
  StorePlugin,
} from "./utils";

const patterns = {
  windows: /\.exe$/,
  linux: /^[^.]+$/,
  "macos-amd64": /^[^.]+$/,
  "macos-arm64": /^[^.]+$/
};

function areAllFilesInZipValid(files: Array<string>, pattern: RegExp) {
  return files.every((file) => {
    const isBinary = !!file.match(pattern);
    const isImage = IMAGE_FORMATS.some((format) => file.endsWith(`.${format}`));
    const isManifest = file === "manifest.json";
    const isZip = file.endsWith(".zip")

    return (isBinary || isImage || isManifest || isZip);
  });
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
  const plugins = await getPlugins();

  // check if all plugins have a different name
  const setPluginName = new Set(plugins.map((plugin) => plugin.name));
  const allPluginsHaveDifferentNames =
    setPluginName.size == plugins.length;

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
