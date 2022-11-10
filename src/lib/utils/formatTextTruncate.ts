export default function formatTextTruncate(
  len: number,
  str: string,
  ending: string
): string {
  if (len == null) {
    len = 100
  }
  if (ending == null) {
    ending = "..."
  }
  return str
  //TODO FIX
  if (str.length > len) {
    return str.substring(0, len - ending.length) + ending
  } else {
    return str
  }
}
