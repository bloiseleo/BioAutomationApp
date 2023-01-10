const {pathToIcon, cliapp} = require('../Constants.js')

module.exports = {
  packagerConfig: {
    extraResource: cliapp
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',
      config: {
        language: 1046, // Português - Brasileiro
        name: 'BioAutomation',
        manufacturer: "BioInfoGroup",
        version: "1.0.0",
        exe: "BioAutomation",
        shortcutFolderName: "BioAutomation",
        icon: pathToIcon
      }
    }
  ],
};
