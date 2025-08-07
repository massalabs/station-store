import * as jsonschema from "jsonschema";
import * as jsonfile from "jsonfile";
import { getManifestContent, pluginStructure, structure } from ".";
import slugify from "slugify";

const semver = require("semver");
const STORE_LIST_URL =
  "https://raw.githubusercontent.com/massalabs/station-store/main/plugins.json";

type Asset = {
  url: string;
  checksum: string;
};

type TypePlugin = {
  name: string;
  author: string;
  logo: string;
  description: string;
  massaStationVersion: string;
  assets: {
    windows: Asset;
    linux: Asset;
    "macos-arm64": Asset;
    "macos-amd64": Asset;
  };
  version: string;
  url: string;
};

export class StorePlugin {
  name: string;
  author: string;
  logo: string;
  description: string;
  massaStationVersion: string;
  assets: {
    windows: Asset;
    linux: Asset;
    "macos-arm64": Asset;
    "macos-amd64": Asset;
  };
  version: string;
  url: string;

  constructor(plugin: TypePlugin) {
    this.name = plugin.name;
    this.author = plugin.author;
    this.logo = plugin.logo;
    this.description = plugin.description;
    this.massaStationVersion = plugin.massaStationVersion;
    this.assets = plugin.assets;
    this.version = plugin.version;
    this.url = plugin.url;
  }

  getLogoPath() {
    const name_slugified = slugify(this.name, { lower: true });
    const pluginAssetDirectory = `assets/${name_slugified}`;
    return `${pluginAssetDirectory}/${this.logo}`;
  }
  isFollowingStructure() {
    return jsonschema.validate(this, structure).errors.length == 0;
  }

  async isPluginManifestInAssetFollowingStructure(assetUrl: string) {
    const pluginManifest = await getManifestContent(assetUrl);

    return (
      jsonschema.validate(pluginManifest, pluginStructure).errors.length == 0
    );
  }

  getPluginLastVersion(lastVersionPlugins: StorePlugin[]) {
    return lastVersionPlugins.find(
      (lastVersionPlugin) => lastVersionPlugin.name === this.name
    );
  }
  isNewVersionHigher(lastVersionPlugins: StorePlugin[]) {
    let lastVersionPlugin = this.getPluginLastVersion(lastVersionPlugins);
    if (!lastVersionPlugin) {
      throw new Error("Plugin not found in last version");
    }
    return semver.gt(this.version, lastVersionPlugin.version);
  }
}

export async function writePluginsData(plugins: StorePlugin[]) {
  await jsonfile.writeFile("plugins.json", plugins);
}

export async function getPluginsData() {
  return await jsonfile.readFile("plugins.json");
}

export async function getPlugins() {
  const plugins: TypePlugin[] = await getPluginsData();
  return plugins.map((plugin) => new StorePlugin(plugin));
}
