import {FunctionComponent} from "react"
import {Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react"
import {OrderReturnItem} from "ordercloud-javascript-sdk"
import formatPrice from "lib/utils/formatPrice"

interface OcOrderReturnItemListProps {
  itemsToReturn: OrderReturnItem[]
}

const OcOrderReturnItemList: FunctionComponent<OcOrderReturnItemListProps> = ({
  itemsToReturn
}) => {
  return itemsToReturn && itemsToReturn.length ? (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Quantity</Th>
            <Th>Refund Amount</Th>
            <Th>Comments</Th>
          </Tr>
        </Thead>
        <Tbody>
          {itemsToReturn.map((item) => (
            <Tr key={item.LineItemID}>
              <Td>{item.LineItemID}</Td>
              <Td>{item.Quantity}</Td>
              <Td>{formatPrice(item.RefundAmount)}</Td>
              <Td>{item.Comments}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    <h3>No items to display.</h3>
  )
}

export default OcOrderReturnItemList
