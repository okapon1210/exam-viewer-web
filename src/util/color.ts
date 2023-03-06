import CryptoJS from "crypto-js"

export function getColorCode(str: string) {
  return `#${CryptoJS.SHA3(str, { outputLength: 32 })
    .toString()
    .slice(0, 6)}`
}
