import {useEffect, useState} from "react"

import {AddEditForm} from "../../lib/components/buyers/AddEditForm"
import {Buyer} from "ordercloud-javascript-sdk"
import {buyersService} from "../../lib/api"
import {useRouter} from "next/router"

const BuyerListItem = () => {
  const router = useRouter()
  const [buyer, setBuyer] = useState({} as Buyer)
  useEffect(() => {
    if (router.query.id) {
      buyersService.getById(router.query.id).then((buyer) => setBuyer(buyer))
    }
  }, [router.query.id])
  return <>{buyer?.ID ? <AddEditForm buyer={buyer} /> : <div> Loading</div>}</>
}

export default BuyerListItem
