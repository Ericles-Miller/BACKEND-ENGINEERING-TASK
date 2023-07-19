export type UploadDTO = {
  fieldName: string;
  originalName: string;
  mineType: string;
  buffer: Buffer;
  size: number
}