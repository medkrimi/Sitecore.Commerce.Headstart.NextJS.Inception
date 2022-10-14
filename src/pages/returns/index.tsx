import {
  Container,
  Heading,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react"
import {formatDate} from "lib/utils/formatDate"
import formatPrice from "lib/utils/formatPrice"
import {NextSeo} from "next-seo"
import NextLink from "next/link"
import {OrderReturns, OrderReturn} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"

const TableRow = (orderReturn: OrderReturn) => {
  return (
    <Tr>
      <Td>
        <NextLink href={`/returns/${orderReturn.ID}`} passHref>
          <Link>{orderReturn.ID}</Link>
        </NextLink>
      </Td>
      <Td>{formatDate(orderReturn.DateCreated)}</Td>
      <Td>{formatPrice(orderReturn.RefundAmount)}</Td>
      {/* Space before capital letters */}
      <Td>{orderReturn.Status.replace(/[A-Z]/g, " $&").trim()}</Td>
    </Tr>
  )
}

const ReturnsPage = () => {
  const [returns, setReturns] = useState([])

  const getReturns = async () => {
    const returnsList = await OrderReturns.List({sortBy: ["DateSubmitted"]})
    setReturns(returnsList.Items)
  }

  useEffect(() => {
    getReturns()
  }, [])

  const returnsContent = returns.length ? (
    returns.map((orderReturn) => TableRow(orderReturn))
  ) : (
    <Tr>
      <Td colSpan={3}>No returns available</Td>
    </Tr>
  )

  return (
    <Container maxW="container.lg" padding="4">
      <NextSeo title="Returns" />
      <Heading as="h2">Returns</Heading>
      <Table variant="striped" margin={30}>
        <Thead>
          <Tr>
            <Th>Return Number</Th>
            <Th>Date Created</Th>
            <Th>Refund Amount</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>{returnsContent}</Tbody>
      </Table>
    </Container>
  )
}

export default ReturnsPage
