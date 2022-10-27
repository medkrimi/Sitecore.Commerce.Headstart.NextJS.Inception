/**
 * Removes HTML from the passed string
 * ex:
 * Parameter: "<p>The Rocket III Project started in 1998 &NBSP; led by Triumph Product Range Manager Ross Clifford </p>"
 * Result:    "The Rocket III Project started in 1998 led by Triumph Product Range Manager Ross Clifford"
 * https://date-fns.org/v2.29.2/docs/format
 */
export function stripHTML(myString: string) {
  const regex = /(&nbsp;|<([^>]+)>)/gi
  const strippedHTML = myString.replace(regex, "")
  return strippedHTML
}
