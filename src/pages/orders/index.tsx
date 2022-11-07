import {
  Button,
  Checkbox,
  Container,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
  Text,
  CheckboxGroup,
  Stack,
  VStack,
  Divider,
  IconButton
} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import {Me, Orders} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import Link from "../../lib/components/navigation/Link"
import {formatDate} from "lib/utils/formatDate"
import formatPrice from "lib/utils/formatPrice"
import {
  GetAuthenticationStatus,
  OcAuthState
} from "lib/scripts/OrdercloudService"
import formatStatus from "lib/utils/formatStatus"
import LettersCard from "lib/components/card/LettersCard"
import formatTextTruncate from "lib/utils/formatTextTruncate"
import {ChevronDownIcon} from "@chakra-ui/icons"
import Card from "lib/components/card/Card"
import {HiOutlineMinusSm} from "react-icons/hi"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [authState, setAuthState] = useState<OcAuthState>()

  useEffect(() => {
    const getOrders = async () => {
      const state = GetAuthenticationStatus()
      setAuthState(state)
      const ordersList = state?.isAdmin
        ? await Orders.List("All")
        : await Me.ListOrders()
      setOrders(ordersList.Items)
    }
    getOrders()
  }, [])

  const ordersContent = orders.length ? (
    orders.map((order) => (
      <Tr key={order.ID}>
        <Td>
          <Checkbox pr="10px"></Checkbox>
          <Link href={`/orders/${order.ID}`}>{order.ID}</Link>
        </Td>
        <Td>{formatDate(order.DateSubmitted)}</Td>
        <Td>{formatStatus(order.Status)}</Td>
        <Td>
          <HStack>
            <LettersCard
              FirstName={order.FromUser.FirstName}
              LastName={order.FromUser.LastName}
            />
            <Text>
              {order.FromUser.FirstName} {order.FromUser.LastName}
            </Text>
          </HStack>
        </Td>
        <Td>{formatTextTruncate(50, order.OrderItem, "...")}</Td>
        <Td>{order.LineItemCount}</Td>
        <Td>{formatPrice(order.Total)}</Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={7}>No orders have been submitted</Td>
    </Tr>
  )

  return (
    <Container maxW="full">
      <NextSeo title="Orders List" />
      <Heading as="h2" marginTop={5}>
        Orders List
      </Heading>
      <HStack justifyContent="space-between" w="100%">
        <Button variant="primaryButton">New Order</Button>
        <HStack>
          <Menu>
            <MenuButton
              px={4}
              py={2}
              transition="all 0.2s"
              borderRadius="md"
              borderWidth="1px"
              _hover={{bg: "gray.400"}}
              _expanded={{bg: "blue.400"}}
              _focus={{boxShadow: "outline"}}
            >
              Filters <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <MenuItem>
                <VStack>
                  <Text>Product Status</Text>
                  <CheckboxGroup>
                    <Stack spacing={[1, 3]} direction={["column", "row"]}>
                      <Checkbox value="Completed" defaultChecked>
                        Completed
                      </Checkbox>
                      <Checkbox value="AwaitingApproval" defaultChecked>
                        Awaiting Approval
                      </Checkbox>
                      <Checkbox value="Canceled" defaultChecked>
                        Canceled
                      </Checkbox>
                      <Checkbox value="Declined" defaultChecked>
                        Declined
                      </Checkbox>
                      <Checkbox value="Open" defaultChecked>
                        Open
                      </Checkbox>
                    </Stack>
                  </CheckboxGroup>
                  <Divider />
                  <HStack>
                    {/*<Button size="md" bg={boxBgColor} color={color}>
                      Clear
                    </Button>
                  <Button size="md" bg={boxBgColor} color={color}>
                      Submit
                    </Button> */}
                  </HStack>
                </VStack>
              </MenuItem>
            </MenuList>
          </Menu>
          <Button variant="secondaryButton">Export CSV</Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <IconButton
          variant="closePanelButton"
          aria-label="close panel"
          icon={<HiOutlineMinusSm />}
        ></IconButton>
        <Table margin={30}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th>Customer</Th>
              <Th>Products</Th>
              <Th># of Line Items</Th>
              <Th>Revenue</Th>
            </Tr>
          </Thead>
          <Tbody>{ordersContent}</Tbody>
        </Table>
        <Button variant="tertiaryButton">
          Scroll down to load more orders
        </Button>
      </Card>
    </Container>
  )
}

export default OrdersPage
