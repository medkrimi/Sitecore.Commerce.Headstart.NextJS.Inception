import {
  Container,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import {Me, Orders} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import Link from "../../lib/components/navigation/Link"
import {formatDate} from "lib/utils/formatDate"
import useOcAuth from "lib/hooks/useOcAuth"
import formatPrice from "lib/utils/formatPrice"

const OrdersPage = () => {
  const {isAdmin} = useOcAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const getOrders = async () => {
      const ordersList = isAdmin
        ? await Orders.List("All")
        : await Me.ListOrders()
      setOrders(ordersList.Items)
    }
    getOrders()
  }, [isAdmin])

  const ordersContent = orders.length ? (
    orders.map((order) => (
      <Tr key={order.ID}>
        <Td>
          <Link href={`/orders/${order.ID}`}>{order.ID}</Link>
        </Td>
        {isAdmin && (
          <Td>
            {order.FromUser.FirstName} {order.FromUser.LastName}
          </Td>
        )}
        <Td>{formatDate(order.DateSubmitted)}</Td>
        <Td>{formatPrice(order.Total)}</Td>
        <Td>{order.LineItemCount}</Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={4}>No orders have been submitted</Td>
    </Tr>
  )

  return (
    <Container maxWidth={"120ch"}>
      <NextSeo title={isAdmin ? "Orders" : "My Orders"} />
      <Heading as="h2" marginTop={5}>
        {isAdmin ? "Orders" : "My Orders"}
      </Heading>
      <Table variant="striped" margin={30}>
        <Thead>
          <Tr>
            <Th>Order Number</Th>
            {isAdmin && <Th>Submitted By</Th>}
            <Th>Date Submitted</Th>
            <Th>Total</Th>
            <Th>Item Count</Th>
          </Tr>
        </Thead>
        <Tbody>{ordersContent}</Tbody>
      </Table>
    </Container>
  )
}

export default OrdersPage
