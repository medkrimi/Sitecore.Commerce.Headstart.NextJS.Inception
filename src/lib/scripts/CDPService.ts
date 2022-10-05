export async function getGuestRefByEmail(email: string): Promise<string> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_CDP_ENDPOINT + "/guests/?email=" + email,
    {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          "Basic " + process.env.NEXT_PUBLIC_CDP_CLIENT_KEY_SECRET_ENCODED
      }
    }
  )
  var responseJson = (await response.json()) as getGuestRefByEmailInterface // parses JSON response into native JavaScript objects
  console.log(responseJson)
  var guestUrl = responseJson.items[0].href
  return guestUrl
}

export async function getGuestContext(email: string): Promise<CdpGuestModel> {
  var guestUrl = await getGuestRefByEmail(email)
  guestUrl = guestUrl.replace("guests", "guestContexts")
  guestUrl +=
    "?expand=items.sessions(offset%3A0%2Climit%3A100)&source=all&timeout=30000"
  const contextResponse = await fetch(guestUrl, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        "Basic " + process.env.NEXT_PUBLIC_CDP_CLIENT_KEY_SECRET_ENCODED
    }
  })

  var guestData: CdpGuestModel = await contextResponse.json().catch((error) => {
    console.log(error)
  })

  return guestData
}

interface getGuestRefByEmailInterface {
  href: string
  offset: number
  limit: string
  items: hrefs[]
}

interface hrefs {
  href: string
}

export interface CdpGuestModel {
  clientKey: string
  createdAt: Date
  dataExtensions: userExtension[]
  dateOfBirth: Date
  email: string
  firstName: string
  firstSeen: Date
  gender: string
  guestType: string
  href: string
  language: string
  lastName: string
  lastSeen: Date
  modifiedAt: Date
  orders: order[]
  sessions: session[]
  ref: string
}

interface order {}

interface session {
  channel: string
  createdAt: Date
  duration: number
  endedAt: Date
  modifiedAt: Date
  sessionType: string
  startedAt: Date
  status: string
  events: event[]
  pointOfSale: string
}

interface event {
  channel: string
  createdAt: Date
  modifiedAt: Date
  status: string
  type: string
  arbitraryData: arbitraryData
  pointOfSale: string
}

interface arbitraryData {
  currency: string
  language: string
  page: string
  websiteBaseUrl: string
}

interface userExtension {}
