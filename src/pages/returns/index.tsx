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
  Heading,
  IconButton,
  Link,
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
  VStack,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react"
import {
  OrderReturn,
  OrderReturnItem,
  OrderReturns
} from "ordercloud-javascript-sdk"
import React, {useRef} from "react"
import {useEffect, useState} from "react"

import Card from "lib/components/card/Card"
import {ChevronDownIcon} from "@chakra-ui/icons"
import NextLink from "next/link"
import {NextSeo} from "next-seo"
import {dateHelper} from "lib/utils/date.utils"
import {priceHelper} from "lib/utils/price.utils"
import {textHelper} from "lib/utils/text.utils"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

const TableRow = (orderReturn: OrderReturn) => {
  let currentItems: OrderReturnItem[] = orderReturn.ItemsToReturn
  return (
    <Tr>
      <Td>
        <Checkbox pr="10px"></Checkbox>
        <NextLink href={`/returns/${orderReturn.ID}`} passHref>
          <Link>{orderReturn.ID}</Link>
        </NextLink>
      </Td>
      <Td>{dateHelper.formatDate(orderReturn.DateCreated)}</Td>
      <Td>{textHelper.formatStatus(orderReturn.Status)}</Td>
      <Td>
        {/* <LettersCard>
          firstname={orderReturn.FromUser.FirstName}, lastname=
          {orderReturn.FromUser.LastName}
        </LettersCard>
        {orderReturn.FromUser.FirstName} {orderReturn.FromUser.LastName} */}
      </Td>
      <Td>
        {textHelper.formatTextTruncate(
          50,
          orderReturn.ItemsToReturn.toString(),
          "..."
        )}
      </Td>
      <Td></Td>
      <Td>{priceHelper.formatPrice(orderReturn.RefundAmount)}</Td>
    </Tr>
  )
}

const ReturnsPage = () => {
  const [returns, setReturns] = useState([])
  const getReturns = async () => {
    const returnsList = await OrderReturns.List({sortBy: ["DateSubmitted"]})
    setReturns(returnsList.Items)
  }

  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef()

  const requestExportCSV = () => {}

  useEffect(() => {
    getReturns()
  }, [])

  const returnsContent = returns.length ? (
    returns.map((orderReturn) => TableRow(orderReturn))
  ) : (
    <Tr>
      <Td colSpan={7}>No returns available</Td>
    </Tr>
  )
  const showInfiniteScrollBtn = returns.length
  const loadMoreButton = showInfiniteScrollBtn != 0 && (
    <HStack justifyContent="center">
      <Button variant="tertiaryButton">Scroll down to load more returns</Button>
    </HStack>
  )

  return (
    <Container maxW="full">
      <NextSeo title="Returns" />
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Link href={`/returns/new`}>
          <Button variant="primaryButton">New Return</Button>
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
                    {/* <Button variant="secondaryButton">
                      Clear
                    </Button>
                    <Button variant="secondaryButton">
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
        <Table margin={30}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th>Customer</Th>
              <Th>Products</Th>
              <Th># of Line Items</Th>
              <Th>Returned Revenue</Th>
            </Tr>
          </Thead>
          <Tbody>{returnsContent}</Tbody>
        </Table>
        {/* {loadMoreButton} */}
      </Card>
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export Selected Returns to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the select returns to a CSV, once the export button is
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
                  {loading ? <Spinner color="brand.500" /> : "Export Returns"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}

const ProtectedReturnsPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <ReturnsPage />
    </ProtectedContent>
  )
}

export default ProtectedReturnsPage

export async function getStaticProps() {
  return {
    props: {
      title: "Returns Listing"
    }
  }
}
