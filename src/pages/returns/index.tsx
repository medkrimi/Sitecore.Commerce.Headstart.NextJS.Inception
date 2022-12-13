import {ChevronDownIcon} from "@chakra-ui/icons"
import {
  Button,
  CheckboxGroup,
  Container,
  Heading,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  Checkbox,
  Divider,
  useColorMode,
  useColorModeValue,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Spinner
} from "@chakra-ui/react"
import Card from "lib/components/card/Card"
import LettersCard from "lib/components/card/LettersCard"
import formatTextTruncate from "lib/utils/formatTextTruncate"
import {formatDate} from "lib/utils/formatDate"
import formatPrice from "lib/utils/formatPrice"
import formatStatus from "lib/utils/formatStatus"
import {NextSeo} from "next-seo"
import NextLink from "next/link"
import {
  OrderReturns,
  OrderReturn,
  OrderReturnItem
} from "ordercloud-javascript-sdk"
import React, {useRef} from "react"
import {useEffect, useState} from "react"
import {HiOutlineMinusSm} from "react-icons/hi"

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
      <Td>{formatDate(orderReturn.DateCreated)}</Td>
      <Td>{formatStatus(orderReturn.Status)}</Td>
      <Td>
        {/* <LettersCard>
          firstname={orderReturn.FromUser.FirstName}, lastname=
          {orderReturn.FromUser.LastName}
        </LettersCard>
        {orderReturn.FromUser.FirstName} {orderReturn.FromUser.LastName} */}
      </Td>
      <Td>
        {formatTextTruncate(50, orderReturn.ItemsToReturn.toString(), "...")}
      </Td>
      <Td></Td>
      <Td>{formatPrice(orderReturn.RefundAmount)}</Td>
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
      <Heading as="h2">Returns List</Heading>
      <HStack justifyContent="space-between" w="100%">
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
                clicked behind the scense a job will be kicked off to create the
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

export default ReturnsPage
