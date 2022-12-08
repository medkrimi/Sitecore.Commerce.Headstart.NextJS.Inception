/*
OrderCloud API return a deep nested object with xp(Exetended propreties).
In some case we need to flat the object for easier use and binding with Forms for example.
Code has been inspired by: https://www.geeksforgeeks.org/flatten-javascript-objects-into-a-single-depth-object/
There are c couple of yarn packages, but they don't support the custom separator 
In form validation we need the object to be like xp_propName and not xp.propName.
*/

export default function flattenObject(ob: object, separator: string): object {
  let result = {}
  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObject(ob[i], separator)
      for (const j in temp) {
        result[i + separator + j] = temp[j]
      }
    } else {
      result[i] = ob[i]
    }
  }
  return result
}
