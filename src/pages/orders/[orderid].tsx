import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Input,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Tr,
  VStack,
  useColorMode,
  useColorModeValue,
  useToast
} from "@chakra-ui/react"
import {
  GetAuthenticationStatus,
  OcAuthState
} from "../../lib/services/ordercloud.service"
import {
  IntegrationEvents,
  OrderReturn,
  OrderReturns,
  OrderWorksheet,
  Orders
} from "ordercloud-javascript-sdk"
import React, {FunctionComponent, useEffect, useRef, useState} from "react"
import {dateHelper, priceHelper} from "lib/utils/"

import AddressCard from "../../lib/components/card/AddressCard"
import Card from "lib/components/card/Card"
import {HiOutlineMinusSm} from "react-icons/hi"
import LettersCard from "lib/components/card/LettersCard"
import NextLink from "next/link"
import {NextSeo} from "next-seo"
import OcLineItemList from "lib/components/shoppingcart/OcLineItemList"
import {useRouter} from "next/router"

const OrderConfirmationPage: FunctionComponent = () => {
  const [authState, setAuthState] = useState<OcAuthState>()
  const router = useRouter()
  const [orderWorksheet, setOrderWorksheet] = useState({} as OrderWorksheet)
  const [orderReturns, setOrderReturns] = useState({} as OrderReturn[])
  const [isRefundDialogOpen, setRefundDialogOpen] = useState(false)
  const [returnComments, setReturnComments] = useState("")
  const [orderReturn, setOrderReturn] = useState({} as OrderReturn)
  const [orderShip, setOrderShip] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef()
  const toast = useToast()

  const requestRefund = () => {
    setOrderReturn({
      OrderID: orderWorksheet.Order.ID,
      RefundAmount: orderWorksheet.Order.Total,
      Comments: returnComments
    })
  }

  const handleReturnCommentChange = (
    event: React.FormEvent<HTMLTextAreaElement>
  ) => {
    setReturnComments(event.currentTarget.value)
  }

  useEffect(() => {
    let authState = GetAuthenticationStatus()
    setAuthState(authState)

    const getOrder = async () => {
      const orderId = router.query.orderid as string
      if (!orderId) {
        return
      }
      const [worksheet, returns] = await Promise.all([
        IntegrationEvents.GetWorksheet("All", orderId),
        OrderReturns.List({filters: {OrderID: orderId}})
      ])
      setOrderWorksheet(worksheet)
      setOrderReturns(returns.Items)
    }

    if (!orderReturn?.OrderID) {
      getOrder()
    }
  }, [router.query.orderid, orderReturn])

  useEffect(() => {
    const shipOrder = async () => {
      const orderId = router.query.orderid as string
      if (!orderId) {
        return
      }
      await Orders.Complete("All", orderId)
      const worksheet = await IntegrationEvents.GetWorksheet("All", orderId)
      setOrderWorksheet(worksheet)
    }

    if (orderShip) {
      shipOrder()
    }
  }, [router.query.orderid, orderShip])

  useEffect(() => {
    const createReturn = async () => {
      try {
        setLoading(true)
        const submittedReturn = await OrderReturns.Create(orderReturn)
        await OrderReturns.Submit(submittedReturn.ID)
        setOrderReturn({} as OrderReturn)
        setLoading(false)
        setRefundDialogOpen(false)
        toast({
          title: "Refund requested!",
          description: "If approved, amount will be credited to you",
          status: "success",
          duration: 8000,
          isClosable: true,
          position: "top"
        })
      } catch {
        setRefundDialogOpen(false)
      }
    }
    if (orderReturn?.OrderID) {
      createReturn()
    }
  }, [orderReturn, toast])

  if (!orderWorksheet?.Order?.ID) {
    return (
      <>
        <NextSeo title="Order" />
      </>
    )
  }

  const showRefundBtn =
    !authState?.isAdmin &&
    orderWorksheet.Order.Status === "Completed" &&
    !orderReturns.length

  const showShipBtn =
    authState?.isAdmin && orderWorksheet.Order.Status === "Open"

  const refundBtn = showRefundBtn && (
    <Button onClick={() => setRefundDialogOpen(true)}>Request Refund</Button>
  )

  const shipBtn = showShipBtn && (
    <Button onClick={() => setOrderShip(true)}>Ship Order</Button>
  )

  const actionButtons = (showRefundBtn || showShipBtn) && (
    <Flex justifyContent="flex-start" marginBottom={10}>
      {refundBtn}
      {shipBtn}
    </Flex>
  )

  const getOrderStatus = (): string => {
    if (!orderReturns.length) {
      return orderWorksheet.Order.Status
    }
    return `Refund ${orderReturns[0].Status}`
  }

  const orderStatus = getOrderStatus()

  return (
    <>
      <NextSeo title={`Order ${orderWorksheet.Order.ID}`} />
      <Container maxW="full" marginTop={30} marginBottom={30}>
        <NextSeo title="Order Details" />
        <Heading as="h2" marginTop={5}>
          Order Details
        </Heading>
        <HStack justifyContent="space-between" w="100%">
          <NextLink href="new" passHref>
            <Link pl="2" pr="2">
              <Link href={`/orders/new`}>
                <Button variant="primaryButton">New Order</Button>
              </Link>
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
            <HStack justifyContent="space-between" w="100%">
              <Heading pb="20px">Order Information</Heading>
              <Text>Status: {orderStatus}</Text>
            </HStack>

            <HStack>
              <LettersCard
                FirstName={orderWorksheet.Order.FromUser.FirstName}
                LastName={orderWorksheet.Order.FromUser.LastName}
              />
              <VStack textAlign="left" w="100%">
                <HStack textAlign="left" w="100%">
                  <Text textAlign="left">
                    {orderWorksheet.Order.FromUser.FirstName}
                  </Text>
                  <Text textAlign="left">
                    {orderWorksheet.Order.FromUser.LastName}
                  </Text>
                </HStack>
                <Text textAlign="left" w="100%">
                  {orderWorksheet.Order.FromUser.Phone}
                </Text>
                <Text textAlign="left" w="100%">
                  {orderWorksheet.Order.FromUser.Email}
                </Text>
              </VStack>
            </HStack>
            <Grid templateColumns="repeat(3, 1fr)" gap={20} pt="20">
              <GridItem w="100%">
                <VStack>
                  <Text width="full">Invoice Number</Text>
                  <Input
                    placeholder="Invoice Number"
                    defaultValue={orderWorksheet.Order.ID}
                  ></Input>
                  <Text width="full">Billing Address</Text>
                  <AddressCard
                    Street1={orderWorksheet.Order.BillingAddress.Street1}
                    Street2={orderWorksheet.Order.BillingAddress.Street2}
                    City={orderWorksheet.Order.BillingAddress.City}
                    State={orderWorksheet.Order.BillingAddress.State}
                    Zip={orderWorksheet.Order.BillingAddress.Zip}
                  />
                  <Text width="full" pt="20px">
                    Buyer Comments
                  </Text>
                  <Textarea defaultValue={orderWorksheet.Order.Comments} />
                </VStack>
              </GridItem>
              <GridItem w="100%">
                <VStack>
                  <Text width="full">Order Placed</Text>
                  <Input
                    placeholder="Order Placed"
                    defaultValue={dateHelper.formatDate(
                      orderWorksheet.Order.DateSubmitted
                    )}
                  ></Input>
                  <Text width="full">Shipping Address</Text>
                  <AddressCard
                    Street1={
                      orderWorksheet.LineItems[0].ShippingAddress.Street1
                    }
                    Street2={
                      orderWorksheet.LineItems[0].ShippingAddress.Street2
                    }
                    City={orderWorksheet.LineItems[0].ShippingAddress.City}
                    State={orderWorksheet.LineItems[0].ShippingAddress.State}
                    Zip={orderWorksheet.LineItems[0].ShippingAddress.Zip}
                  />
                </VStack>
              </GridItem>
              <GridItem w="100%" justifyContent="center">
                <Box
                  border="1px"
                  borderColor="gray.200"
                  padding="20px"
                  w="100%"
                  maxW="450px"
                >
                  <VStack>
                    <Text>Order Recap</Text>
                    <Divider border="1px" borderColor="gray.200" />
                    <Flex
                      flexDirection="column"
                      marginLeft={10}
                      w="full"
                      pr="10"
                      pl="10"
                    >
                      <Table
                        size="sm"
                        width="full"
                        maxWidth="100%"
                        marginBottom={5}
                      >
                        <Tbody>
                          <Tr>
                            <Td>Subtotal</Td>
                            <Td textAlign="right">
                              <Text fontWeight="bold">
                                {priceHelper.formatPrice(
                                  orderWorksheet.Order.Subtotal
                                )}
                              </Text>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>Promotion Discount</Td>
                            <Td textAlign="right">
                              <Text fontWeight="bold">
                                -
                                {priceHelper.formatPrice(
                                  orderWorksheet.Order.PromotionDiscount
                                )}
                              </Text>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>Shipping</Td>
                            <Td textAlign="right">
                              <Text fontWeight="bold">
                                {priceHelper.formatPrice(
                                  orderWorksheet.Order.ShippingCost
                                )}
                              </Text>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>Tax</Td>
                            <Td textAlign="right">
                              <Text fontWeight="bold">
                                {priceHelper.formatPrice(
                                  orderWorksheet.Order.TaxCost
                                )}
                              </Text>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>Order Total</Td>
                            <Td textAlign="right">
                              <Text fontWeight="bold">
                                {priceHelper.formatPrice(
                                  orderWorksheet.Order.Total
                                )}
                              </Text>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Flex>
                  </VStack>
                </Box>
              </GridItem>
            </Grid>
          </Flex>
        </Card>
        {actionButtons}
        <Card variant="primaryCard">
          <IconButton
            variant="closePanelButton"
            aria-label="close panel"
            icon={<HiOutlineMinusSm />}
          ></IconButton>
          <Flex flexDirection="column" p="10">
            <OcLineItemList
              lineItems={orderWorksheet.LineItems}
              editable={false}
            />
          </Flex>
        </Card>
      </Container>
      <AlertDialog
        isOpen={isRefundDialogOpen}
        onClose={() => setRefundDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Request Refund
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                A return for this order will be requested and if approved will
                refund the balance of
              </Text>{" "}
              <Text display="inline" color="brand.500" fontWeight="bold">
                {priceHelper.formatPrice(orderWorksheet.Order.Total)}
              </Text>
              <Textarea
                marginTop={8}
                placeholder="Optional comments"
                defaultValue={returnComments}
                onChange={handleReturnCommentChange}
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setRefundDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={requestRefund} disabled={loading}>
                {loading ? <Spinner color="brand.500" /> : "Request Refund"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default OrderConfirmationPage
