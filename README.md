# MassaStation Plugin Store

MassaLabs' official plugin list available for MassaStation.

## How to add your plugin:

1. Prepare your plugin with the following information:

- **name**: 30 characters max
- **author**: 30 characters max
- **description**: 80 characters max
- **logo**: square image file, 40x40 pixels max in the assets/<plugin-name> folder.
- **massaStationVersion** : indicate the requirements for the MassaStation version. Example: `>= 0.1.0`
  > Note: the <plugin-name> folder name must be [slugified](https://www.npmjs.com/package/slugify), i.e. dashes instead of spaces, avoid special characters.
- **assets**: a **_url_** to a zip file, and the corresponding **_checksum_** for the following OS:
  - **_windows_**
  - **_linux_**
  - **_macos-arm64_**
  - **_macos-amd64_**
- **url**: the plugin GitHub repository URL.

2. Add your logo to the assets folder:

   - Create a folder with your plugin assets: `mkdir assets/<plugin-name>`
   - Add your logo to the folder: `cp <logo-path> assets/<plugin-name>/<logo-name>` (or just drag and drop it into the folder).

3. Edit the `plugins.json` file to add your plugin information following the template below. You can keep the checksum field empty:

```json
{
  "name": "Plugin name - 30 characters",
  "author": "Plugin author - 30 characters",
  "description": "Plugin description - 80 characters",
  "logo": "Plugin logo URL - 40 pixels",
  "massaStationVersion": "MassaStation version requirements",
  "assets": {
    "windows": {
      "url": "Plugin zip URL for Windows",
      "checksum": "ZIP file MD5 sum"
    },
    "linux": {
      "url": "Plugin zip URL for Linux",
      "checksum": "ZIP file MD5 sum"
    },
    "macos-arm64": {
      "url": "Plugin zip URL for macOS Darwin ARM64",
      "checksum": "ZIP file MD5 sum"
    },
    "macos-amd64": {
      "url": "Plugin zip URL for macOS Darwin AMD64",
      "checksum": "ZIP file MD5 sum"
    }
  },
  "version": "6.6.6",
  "url": "Plugin GitHub repository URL"
},

```
4. Generate the checksums : `npm run write-checksum your-slugified-plugin-name`
> replace spaces in the plugin name by dashes to execute this command
5. Make a pull request to submit your contribution to the MassaLabs team for approval.

## security checks

In order to be approved, your plugin code will be audited by the Massalabs team.
The provided checksums will be verified against the zip files url provided.
