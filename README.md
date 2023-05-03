# Thyra Plugin Store

MassaLabs' official plugin list available for Thyra.

## How to add your plugin:

1. Prepare your plugin with the following information:

- **name**: 30 characters max
- **description**: 80 characters max
- **logo**: square image file, 40x40 pixels max in the assets/<plugin-name> folder.
- **thyra_version** : indicate the requirements for the Thyra version. Example: `>= 0.1.0`
  > Note: the <plugin-name> folder name must be [slugified](https://www.npmjs.com/package/slugify), i.e. dashes instead of spaces, avoid special characters.
- **assets**: a ***URL*** to a zip file, and the corresponding ***checksum*** for the following OS:
  - ***windows***
  - ***linux***
  - ***macOS-arm64***
  - ***macOS-amd64***
- **url**: the plugin GitHub repository URL.

2. Add your logo to the assets folder:

   - Create a folder with your plugin assets: `mkdir assets/<plugin-name>`
   - Add your logo to the folder: `cp <logo-path> assets/<plugin-name>/<logo-name>` (or just drag and drop it into the folder).

3. Edit the `plugins.json` file to add your plugin information following the template below:

```json
{
  "name": "Plugin name - 30 characters",
  "description": "Plugin description - 80 characters",
  "logo": "Plugin logo URL - 40 pixels",
  "thyra_version": "Thyra version requirements",
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

4. Make a pull request to submit your contribution to the MassaLabs team for approval.

## security checks

In order to be approved, your plugin code will be audited by the Massalabs team.
The provided checksums will be verified against the zip files url provided.
