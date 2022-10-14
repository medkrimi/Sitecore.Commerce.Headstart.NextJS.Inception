import {FunctionComponent} from "react"
import useOcCurrentOrder from "../../hooks/useOcCurrentOrder"
import OcLineItemList from "./OcLineItemList"

interface OcCurrentOrderLineItemListProps {
  emptyMessage?: string
  editable?: boolean
}

const OcCurrentOrderLineItemList: FunctionComponent<
  OcCurrentOrderLineItemListProps
> = ({emptyMessage, editable}) => {
  const {lineItems} = useOcCurrentOrder()

  return (
    <OcLineItemList
      emptyMessage={emptyMessage}
      editable={editable}
      lineItems={lineItems}
    />
  )
}

export default OcCurrentOrderLineItemList
