import {useEffect, useState} from "react"

import {AddEditForm} from "../../../../lib/components/usergroups/AddEditForm"
import {UserGroup} from "ordercloud-javascript-sdk"
import {useRouter} from "next/router"
import {userGroupsService} from "../../../../lib/api"

const UserGroupItem = () => {
  const router = useRouter()
  const [userGroup, setuserGroup] = useState({} as UserGroup)
  useEffect(() => {
    if (router.query.buyerid && router.query.usergroupid) {
      userGroupsService
        .getById(router.query.buyerid, router.query.usergroupid)
        .then((userGroup) => setuserGroup(userGroup))
    }
  }, [router.query.buyerid, router.query.usergroupid])
  return (
    <>
      {userGroup?.ID ? (
        <AddEditForm userGroup={userGroup} />
      ) : (
        <div> Loading</div>
      )}
    </>
  )
}

export default UserGroupItem
