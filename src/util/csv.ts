export function parseCsv(arrBuf: ArrayBuffer) {
  return new TextDecoder()
    .decode(arrBuf)
    .replace(/\r\n/g,"\n")
    .split("\n")
    .map((row) => row.split(","))
}
