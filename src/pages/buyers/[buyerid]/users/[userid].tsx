import {useEffect, useState} from "react"

import {AddEditForm} from "../../../../lib/components/users/AddEditForm"
import {User} from "ordercloud-javascript-sdk"
import {useRouter} from "next/router"
import {usersService} from "../../../../lib/api"

const UserItem = () => {
  const router = useRouter()
  const [user, setUser] = useState({} as User)
  useEffect(() => {
    if (router.query.buyerid) {
      usersService
        .getById(router.query.buyerid, router.query.userid)
        .then((user) => setUser(user))
    }
  }, [router.query.buyerid, router.query.userid])
  return <>{user?.ID ? <AddEditForm user={user} /> : <div> Loading</div>}</>
}

export default UserItem
