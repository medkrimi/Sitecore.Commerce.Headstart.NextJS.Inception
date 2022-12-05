import {useEffect, useState} from "react"

import {AddEditForm} from "../../lib/components/buyers/AddEditForm"
import {buyerService} from "../../lib/services"
import {useRouter} from "next/router"
import {Buyer} from "ordercloud-javascript-sdk"

const BuyerListItem = () => {
  const router = useRouter()
  const [buyer, setBuyer] = useState({} as Buyer)
  useEffect(() => {
    if (router.query.id) {
      buyerService.getById(router.query.id).then((buyer) => setBuyer(buyer))
    }
  }, [router.query.id])
  return <>{buyer.ID ? <AddEditForm buyer={buyer} /> : <div> Loading</div>}</>
}

export default BuyerListItem

// export async function getServerSideProps({params}) {
//   let buyer = {}
//   try {
//     buyer = await buyerService.getById(params.id)
//   } catch (err) {
//     console.log(err)
//   }
//   return {
//     props: {buyer}
//   }
// }
