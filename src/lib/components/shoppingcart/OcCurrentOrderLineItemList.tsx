import {ComposedOrder, GetCurrentOrder} from "../../services/ordercloud.service"
import {FunctionComponent, useEffect, useState} from "react"

import OcLineItemList from "./OcLineItemList"

interface OcCurrentOrderLineItemListProps {
  emptyMessage?: string
  editable?: boolean
}

const OcCurrentOrderLineItemList: FunctionComponent<
  OcCurrentOrderLineItemListProps
> = ({emptyMessage, editable}) => {
  const [currentOrder, setCurrentOrder] = useState<ComposedOrder>()

  useEffect(() => {
    async function GetCart() {
      const cart = await GetCurrentOrder()
      setCurrentOrder(cart)
    }

    GetCart()
  }, [])

  return (
    <OcLineItemList
      emptyMessage={emptyMessage}
      editable={editable}
      lineItems={currentOrder.Order.LineItems}
    />
  )
}

export default OcCurrentOrderLineItemList
