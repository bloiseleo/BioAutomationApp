/**
 * This interface must have all functions determinated on preload.js
 */

export interface ElectronWindow extends Window {
  electronAPI: {
    getExtraResourcesPath: () => Promise<string>
  }
}
