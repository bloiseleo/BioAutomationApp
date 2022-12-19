const path = require("path")

class ExtraResources {

  dev = true;

  /**
   *  Class Responsable for dealing with extraResources on process object.
   * @param {bool} dev Defines if we are working on DEV enviroment or Production enviroment
   */
  constructor(dev = true) {
    this.dev = dev
  }
  /**
   *  @returns {string} Path to CLI app.
   */
  get pathToCLIApp() {
    if(this.dev) {
      return path.join(__dirname, "..", "..", "BioAutomationCLI_v2", "dist", "main", "main.exe")
    }
    return path.join(process.resourcesPath, "main", "main.exe")
  }

}

module.exports = ExtraResources
