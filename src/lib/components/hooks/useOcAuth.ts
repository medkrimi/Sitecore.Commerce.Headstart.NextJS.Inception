import {OcAuthState} from "lib/redux/ocAuth"
import {useOcSelector} from "lib/redux/ocStore"

const useOcAuth = (): OcAuthState => useOcSelector((s) => s.ocAuth)

export default useOcAuth
