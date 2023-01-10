const path = require("path")

module.exports = {
  packagerConfig: {
    extraResource: path.join(__dirname, "..", "BioAutomationCLI_v2", "dist", "main")
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
        shortcutFolderName: "BioAutomation"
      }
    }
  ],
};
