import { Workspace } from "./Workspace"

export default interface Process {
  name: string,
  key: string,
  description: string,
  kind: string,
  done: boolean
}

export interface ProcessEvent {
  key: string,
  kind: string,
  serviceName: string,
  resultFile?: File
}


export interface ProcessAPI {
  entry: {
    [key: string]: (workspace: Workspace) => Promise<boolean>
  },
  out: {
    [key: string]: (workspace: Workspace, resultFile: File) => Promise<boolean>
  },
  [key: string]: any
}
