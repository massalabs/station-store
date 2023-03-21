# thyra-plugin-store
Massalabs official plugin list available for Thyra

## How to add your plugin:

Edit the `plugins.json` file to add your plugin informations folowing the template bellow:

```json
   {
    "name": "Plugin name",
    "description": "Plugin description",
    "pluginFile": "Plugin zip url",
    "checksum": "zip file md5sum",
    "version": "6.6.6",
    "url": "plugin github repo url",
  },
```

Make a pull request to submit your contribution to the MassaLabs team approval.

## security checks

In order to be approved, your plugin code will be audited by the Massalabs team.
The provided checksum will be verified against the zip file url provided.
