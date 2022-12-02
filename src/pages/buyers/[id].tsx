import {
  GetAuthenticationStatus,
  OcAuthState
} from "lib/scripts/OrdercloudService"
import {useEffect, useState} from "react"

import {AddEditForm} from "../../lib/components/buyers/AddEditForm"
import {buyerService} from "../../lib/services"

export default AddEditForm

export async function getServerSideProps({params}) {
  const buyer = await buyerService.getById(params.id)

  return {
    props: {buyer}
  }
}
