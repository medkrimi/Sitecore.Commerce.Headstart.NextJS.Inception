import {Flex, Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react"

import {FunctionComponent} from "react"
import {LineItem} from "ordercloud-javascript-sdk"
import OcLineItemCard from "./OcLineItemCard"

interface OcLineItemListProps {
  emptyMessage?: string
  editable?: boolean
  lineItems: LineItem[]
}

const OcLineItemList: FunctionComponent<OcLineItemListProps> = ({emptyMessage, editable, lineItems}) => {
  return lineItems && lineItems.length ? (
    <Flex as="section" gap={3} w="full" width="full">
      <Table>
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>Description</Th>
            <Th>Status</Th>
            <Th>Quantity</Th>
            <Th>Unit Price</Th>
            <Th>Total</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {lineItems.map((li) => (
            <OcLineItemCard lineItem={li} key={li.ID} />
          ))}
        </Tbody>
      </Table>
    </Flex>
  ) : (
    <h3>{emptyMessage}</h3>
  )
}

export default OcLineItemList
