import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Link,
  Spacer,
  useColorMode,
  Text
} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import NextLink from "next/link"
import {useRouter} from "next/router"
import formatPrice from "lib/utils/formatPrice"
import {
  OrderReturn,
  OrderReturns,
  Payment,
  Payments
} from "ordercloud-javascript-sdk"
import {FunctionComponent, useEffect, useState} from "react"
import {formatDate} from "lib/utils/formatDate"
import OcOrderReturnItemList from "lib/components/returns/OcOrderReturnItem"
import {HiOutlineMinusSm} from "react-icons/hi"
import Card from "lib/components/card/Card"

const OrderReturnDetailPage: FunctionComponent = () => {
  const router = useRouter()
  const [orderReturn, setOrderReturn] = useState({} as OrderReturn)
  const [itemsToReturn, setItemsToReturn] = useState([])

  useEffect(() => {
    const getOrderReturn = async () => {
      const orderReturnId = router.query.returnid as string
      if (!orderReturnId) {
        return
      }
      const ocOrderReturn = await OrderReturns.Get(orderReturnId)
      setOrderReturn(ocOrderReturn)
      setItemsToReturn(ocOrderReturn.ItemsToReturn)
    }

    getOrderReturn()
  }, [router.query.returnid])

  const getStatusColor = (): string => {
    switch (orderReturn.Status) {
      case "Completed":
        return "green"
      case "Declined":
        return "red"
      case "Canceled":
        return "red"
      default:
        return "blue"
    }
  }

  const handleCompleteAnOrderReturn = async () => {
    const orderReturnPaymentRequest: Payment = {
      Type: null,
      Description: "Return Payment",
      Amount: -Math.abs(orderReturn.RefundAmount), // Return payment amount must be negative
      Accepted: true,
      OrderReturnID: orderReturn.ID
    }
    await Payments.Create("All", orderReturn.OrderID, orderReturnPaymentRequest)
    const updatedOrderReturn = await OrderReturns.Get(orderReturn.ID)
    setOrderReturn(updatedOrderReturn)
  }

  const handleCancelAnOrderReturn = async () => {
    const canceledOrderReturn = await OrderReturns.Cancel(orderReturn.ID)
    setOrderReturn(canceledOrderReturn)
  }

  if (!orderReturn.ID) {
    return (
      <>
        <NextSeo title="Order Return Detail" />
        Loading...
      </>
    )
  }
  return (
    <>
      <Container maxW="full" marginTop={30} marginBottom={30}>
        <NextSeo title="Order Return Detail" />
        <Heading as="h2" mt="40px">
          Order Return
        </Heading>
        <Heading as="h4" size="md">
          <HStack mb="20px">
            <Text>Return ID:</Text> <Text>{orderReturn.ID}</Text>
          </HStack>
        </Heading>
        <HStack justifyContent="space-between" w="100%">
          <NextLink href="new" passHref>
            <Link pl="2" pr="2">
              <Button variant="primaryButton">New Return</Button>
            </Link>
          </NextLink>
          <HStack>
            <Button variant="secondaryButton">Print Shipping Label</Button>
            <Button variant="secondaryButton">Export PDF</Button>
            <Button variant="secondaryButton">Export CSV</Button>
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <IconButton
            variant="closePanelButton"
            aria-label="close panel"
            icon={<HiOutlineMinusSm />}
          ></IconButton>
          <Flex flexDirection="column" p="10">
            <Box>
              <Badge variant="outline" color={getStatusColor()}>
                {/* Space before capital letters */}
                {orderReturn.Status.replace(/[A-Z]/g, " $&").trim()}
              </Badge>
              <Divider m="3" />
              <Flex minWidth="max-content" alignItems="center" gap="2" mb="4">
                <Box>
                  <Heading size="md">
                    Refund Amount: {formatPrice(orderReturn.RefundAmount)}
                  </Heading>
                </Box>
                <Spacer />
                <ButtonGroup gap="2">
                  {orderReturn.Status === "Open" && (
                    <>
                      <Button
                        colorScheme="teal"
                        variant="solid"
                        onClick={handleCompleteAnOrderReturn}
                      >
                        Complete
                      </Button>
                      <Button
                        colorScheme="red"
                        variant="solid"
                        onClick={handleCancelAnOrderReturn}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </ButtonGroup>
              </Flex>

              <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={6}>
                <GridItem w="100%" h="10">
                  <Heading as="h5" size="sm">
                    Order ID
                  </Heading>
                  {orderReturn.OrderID}
                </GridItem>
                <GridItem w="100%" h="10">
                  <Heading as="h5" size="sm">
                    Request Submitted
                  </Heading>
                  {formatDate(orderReturn.DateSubmitted)}
                </GridItem>
                {orderReturn.DateCanceled && (
                  <GridItem w="100%" h="10">
                    <Heading as="h5" size="sm">
                      Date Canceled
                    </Heading>
                    {formatDate(orderReturn.DateCanceled)}
                  </GridItem>
                )}
                {orderReturn.DateCompleted && (
                  <GridItem w="100%" h="10">
                    <Heading as="h5" size="sm">
                      Date Completed
                    </Heading>
                    {formatDate(orderReturn.DateCompleted)}
                  </GridItem>
                )}
                {orderReturn.Comments && (
                  <GridItem w="100%" h="10">
                    <Heading as="h5" size="sm">
                      Comments
                    </Heading>
                    {orderReturn.Comments}
                  </GridItem>
                )}
              </Grid>
            </Box>
            <Box mt="6">
              <Heading as="h3" size="lg">
                Return Items
              </Heading>
              <Divider m="3" />
              <OcOrderReturnItemList itemsToReturn={itemsToReturn} />
            </Box>
          </Flex>
        </Card>
      </Container>
    </>
  )
}

export default OrderReturnDetailPage
