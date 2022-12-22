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
  "protein_sequence": string
}

interface Workspaces extends Array<Workspace> {}

export {Workspace, Workspaces}
