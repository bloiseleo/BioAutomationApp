export interface ValidationResult {
  valid: boolean,
  message: string
}
export interface ValidationObject {
  value: any,
  validationFunction: (...params: any) => ValidationResult
}

export interface ValidationList extends Array<ValidationObject> {}
