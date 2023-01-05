import {Category, UserGroup} from "ordercloud-javascript-sdk"
import {categoriesService, userGroupsService} from "lib/api"
import {useEffect, useState} from "react"

import {AddEditForm} from "lib/components/categories/AddEditForm"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {useRouter} from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit category",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const CategoryListItem = () => {
  const router = useRouter()
  const [category, setCategory] = useState({} as Category)
  useEffect(() => {
    if (router.query.categoryid) {
      categoriesService
        .getById(router.query.catalogid, router.query.categoryid)
        .then((category) => setCategory(category))
    }
  }, [router.query.catalogid, router.query.categoryid])
  return (
    <>
      {category?.ID ? <AddEditForm category={category} /> : <div> Loading</div>}
    </>
  )
}
const ProtectedBuyerListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="20px">
        <CategoryListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedBuyerListItem
