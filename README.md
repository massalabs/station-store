# thyra-plugin-store
Massalabs official plugin list available for Thyra

## How to add your plugin:

Edit the `plugins.json` file to add your plugin information folowing the template bellow:

```json
   {
  "name": "Plugin name",
  "description": "Plugin description - 80 characters",
  "logo": "Plugin logo url - 40 pixels",
  "assets": {
    "windows": {
      "url": "Plugin zip url for window",
      "checksum": "zip file md5sum"
    },
    "linux": {
      "url": "Plugin zip url for linux",
      "checksum": "zip file md5sum"
    },
    "macos-arm64": {
      "url": "Plugin zip url for macOs darwin arm64",
      "checksum": "zip file md5sum"
    },
    "macos-amd64": {
      "url": "Plugin zip url for macOs darwin amd64",
      "checksum": "zip file md5sum"
    }
  },
  "version": "6.6.6",
  "url": "plugin github repo url",
},
```

Make a pull request to submit your contribution to the MassaLabs team approval.

## security checks

In order to be approved, your plugin code will be audited by the Massalabs team.
The provided checksums will be verified against the zip files url provided.
