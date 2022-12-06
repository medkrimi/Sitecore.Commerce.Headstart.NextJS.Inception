import {alertService, buyerService} from "../../lib/services"
import {useEffect, useState} from "react"

import {AddEditForm} from "../../lib/components/buyers/AddEditForm"
import {Buyer} from "ordercloud-javascript-sdk"
import {useRouter} from "next/router"

const BuyerListItem = () => {
  const router = useRouter()
  const [buyer, setBuyer] = useState({} as Buyer)
  useEffect(() => {
    if (router.query.id) {
      buyerService.getById(router.query.id).then((buyer) => setBuyer(buyer))
    }
    alertService.success("Success Get Buyer", {keepAfterRouteChange: true})
  }, [router.query.id])
  return <>{buyer.ID ? <AddEditForm buyer={buyer} /> : <div> Loading</div>}</>
}

export default BuyerListItem
