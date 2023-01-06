import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react"
import {useEffect, useRef, useState} from "react"

import Card from "lib/components/card/Card"
import {ChevronDownIcon} from "@chakra-ui/icons"
import LettersCard from "lib/components/card/LettersCard"
import Link from "../../lib/components/navigation/Link"
import {NextSeo} from "next-seo"
import {Orders} from "ordercloud-javascript-sdk"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {dateHelper} from "lib/utils/date.utils"
import {priceHelper} from "lib/utils/price.utils"
import {textHelper} from "lib/utils/text.utils"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Orders List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}
const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef()

  const requestExportCSV = () => {}

  useEffect(() => {
    const getOrders = async () => {
      const ordersList = await Orders.List("All")
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
        <Td>{dateHelper.formatDate(order.DateSubmitted)}</Td>
        <Td>{textHelper.formatStatus(order.Status)}</Td>
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
        <Td>{textHelper.formatTextTruncate(50, order.OrderItem, "...")}</Td>
        <Td>{order.LineItemCount}</Td>
        <Td>{priceHelper.formatPrice(order.Total)}</Td>
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
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Link href={`/orders/new`}>
          <Button variant="primaryButton">New Order</Button>
        </Link>
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
          <Button
            variant="secondaryButton"
            onClick={() => setExportCSVDialogOpen(true)}
          >
            Export CSV
          </Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <Table>
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
      </Card>
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export Selected Orders to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the selected orders to a CSV, once the export button is
                clicked behind the scenes a job will be kicked off to create the
                csv and then will automatically download to your downloads
                folder in the browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setExportCSVDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={requestExportCSV} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Export Orders"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}

const ProtectedOrdersPage = () => (
  <ProtectedContent hasAccess={appPermissions.OrderManager}>
    <OrdersPage />
  </ProtectedContent>
)

export default ProtectedOrdersPage
