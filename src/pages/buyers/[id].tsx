import {useEffect, useState} from "react"

import {AddEditForm} from "../../lib/components/buyers/AddEditForm"
import {buyerService} from "../../lib/services"
import {useRouter} from "next/router"

const BuyerListItem = () => {
  const router = useRouter()
  const {id} = router.query
  const [buyer, setBuyer] = useState({})
  useEffect(() => {
    buyerService.getById(id).then((buyer) => setBuyer(buyer))
  }, [])
  console.log("buyer")
  //console.log(buyer)
  return <AddEditForm props={buyer} />
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
