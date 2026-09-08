export const formatAddress = (address: string, startChars: number = 10, endChars: number = 9): string => {
  if (!address || address.length <= startChars + endChars) {
    return address
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}
