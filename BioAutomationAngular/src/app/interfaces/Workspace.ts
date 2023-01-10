// This interface should be the same as definide in Configuration.py on method create_settings_to_workspace

interface Workspace {
  "name": string,
  "path": string,
  "path_to_base_xlsx": string,
  "entry": {
      "predictSNP": {
          "done": boolean,
          "path_to_file": string
      }
  },
  "out": {
    "predictSNP": {
      "done": boolean,
      "path_to_file": string
    }
  }
  "protein_header": string,
  "protein_sequence": string,
  [key: string]: any
}

interface Workspaces {
  [key: string]: Workspace
}

export {Workspace, Workspaces}
