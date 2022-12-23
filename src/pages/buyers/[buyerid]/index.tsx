import {useEffect, useState} from "react"

import {AddEditForm} from "../../../lib/components/buyers"
import {Buyer} from "ordercloud-javascript-sdk"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {buyersService} from "../../../lib/api"
import {useRouter} from "next/router"
import {Box} from "@chakra-ui/react"

/* This declare the page title and enable the breadcrumbs in the content header section. */
/* TODO Ask if this is the way to go or better to have getStaticProps + GetStaticPath in this case */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit buyer",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}
// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: false // can also be true or 'blocking'
//   }
// }

const BuyerListItem = () => {
  const router = useRouter()
  const [buyer, setBuyer] = useState({} as Buyer)
  useEffect(() => {
    if (router.query.buyerid) {
      buyersService
        .getById(router.query.buyerid)
        .then((buyer) => setBuyer(buyer))
    }
  }, [router.query.buyerid])
  return <>{buyer?.ID ? <AddEditForm buyer={buyer} /> : <div> Loading</div>}</>
}

const ProtectedBuyerListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="20px">
        <BuyerListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedBuyerListItem
