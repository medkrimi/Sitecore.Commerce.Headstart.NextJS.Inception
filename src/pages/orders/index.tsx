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
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react"
import {useEffect, useRef, useState} from "react"

import Card from "lib/components/card/Card"
import {ChevronDownIcon} from "@chakra-ui/icons"
import Link from "../../lib/components/navigation/Link"
import {NextSeo} from "next-seo"
import {Orders} from "ordercloud-javascript-sdk"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import SearchDataTable from "lib/components/datatable/datatable"
import {appPermissions} from "lib/constants/app-permissions.config"
import {dateHelper} from "lib/utils/date.utils"
import {priceHelper} from "lib/utils/price.utils"

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
  const [loading] = useState(false)
  const cancelRef = useRef()

  const requestExportCSV = () => {}

  useEffect(() => {
    const getOrders = async () => {
      const ordersList = await Orders.List("All")
      setOrders(ordersList.Items)
    }
    getOrders()
  }, [])

  const columnsData = [
    {
      Header: "ORDER ID",
      accessor: "ID",
      Cell: ({value, row}) => <Link href={`/orders/${row.original.ID}`}>{value}</Link>
    },
    {
      Header: "DATE SUBMITTED",
      accessor: "DateSubmitted",
      Cell: ({value}) => dateHelper.formatDate(value)
    },
    {
      Header: "STATUS",
      accessor: "Status"
    },
    {
      Header: "CUSTOMER",
      accessor: "FromUserID",
      Cell: ({row}) => `${row.original.FromUser.FirstName} ${row.original.FromUser.LastName}`
    },
    {
      Header: "# OF LINE ITEMS",
      accessor: "LineItemCount"
    },
    {
      Header: "TOTAL",
      accessor: "Total",
      Cell: ({value}) => priceHelper.formatPrice(value)
    }
  ]

  return (
    <Container maxW="full">
      <NextSeo title="Orders List" />
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Link href={`/orders/new`}>
          <Button variant="primaryButton">Create Order</Button>
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
                  <HStack></HStack>
                </VStack>
              </MenuItem>
            </MenuList>
          </Menu>
          <Button variant="secondaryButton" onClick={() => setExportCSVDialogOpen(true)}>
            Export CSV
          </Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <SearchDataTable tableData={orders} columnsData={columnsData} />
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
                Export the selected orders to a CSV, once the export button is clicked behind the scenes a job will be
                kicked off to create the csv and then will automatically download to your downloads folder in the
                browser.
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
