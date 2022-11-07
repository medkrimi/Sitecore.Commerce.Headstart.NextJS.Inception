import {
  Badge,
  Container,
  Flex,
  Text,
  Divider,
  Spacer,
  Box,
  Tbody,
  Table,
  Td,
  Tr,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Textarea,
  useToast,
  Spinner
} from "@chakra-ui/react"
import {formatDate} from "lib/utils/formatDate"
import {NextSeo} from "next-seo"
import {useRouter} from "next/router"
import {
  IntegrationEvents,
  OrderReturn,
  OrderReturns,
  OrderWorksheet,
  Orders
} from "ordercloud-javascript-sdk"
import React, {FunctionComponent, useEffect, useRef, useState} from "react"
import AddressCard from "../../lib/components/orders/AddressCard"
import formatPrice from "lib/utils/formatPrice"
import {
  GetAuthenticationStatus,
  OcAuthState
} from "lib/scripts/OrdercloudService"
import OcLineItemList from "lib/components/shoppingcart/OcLineItemList"

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
      <Container maxWidth={"120ch"} marginTop={30} marginBottom={30}>
        <Flex flexDirection="column">
          <Flex marginBottom={showRefundBtn ? 5 : 10}>
            <Flex flexDirection="column">
              <Badge
                style={{fontSize: "large"}}
                fontWeight="bold"
                color="brand.500"
              >
                Order# {orderWorksheet.Order.ID}
              </Badge>
              <Text>
                Placed on {formatDate(orderWorksheet.Order.DateSubmitted)}
              </Text>
              <Text>Status: {orderStatus}</Text>
            </Flex>
            <Spacer />
            <Flex>
              <Flex flexDirection="column">
                <Text fontWeight="bold">Ship To</Text>
                <AddressCard
                  address={orderWorksheet.LineItems[0].ShippingAddress}
                />
              </Flex>
              <Divider orientation="vertical" marginLeft={5} marginRight={5} />
              <Flex flexDirection="column">
                <Text fontWeight="bold">Bill To</Text>
                <AddressCard address={orderWorksheet.Order.BillingAddress} />
              </Flex>
            </Flex>
          </Flex>
          {actionButtons}
          <Box
            bgColor="whitesmoke"
            w="100%"
            padding={5}
            border="1px"
            borderColor="lightgray"
            marginBottom={5}
          >
            <Text fontSize="xx-large" display="inline" marginRight={5}>
              Order Summary
            </Text>
            <Text fontSize="md" display="inline">
              <Badge
                fontWeight="bold"
                color="brand.500"
                style={{fontSize: "large"}}
                marginRight={1}
              >
                {orderWorksheet.Order.LineItemCount}
              </Badge>
              {orderWorksheet.Order.LineItemCount > 1 ? "Items" : "Item"}
            </Text>
          </Box>
          <Flex>
            <OcLineItemList
              lineItems={orderWorksheet.LineItems}
              editable={false}
            />
            <Spacer />
            <Flex flexDirection="column" marginLeft={10}>
              <Table size="sm" minWidth={350} maxHeight={150} marginBottom={5}>
                <Tbody>
                  <Tr>
                    <Td>Subtotal</Td>
                    <Td>
                      <Text fontWeight="bold">
                        {formatPrice(orderWorksheet.Order.Subtotal)}
                      </Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Promotion Discount</Td>
                    <Td>
                      <Text fontWeight="bold">
                        -{formatPrice(orderWorksheet.Order.PromotionDiscount)}
                      </Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Shipping</Td>
                    <Td>
                      <Text fontWeight="bold">
                        {formatPrice(orderWorksheet.Order.ShippingCost)}
                      </Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Tax</Td>
                    <Td>
                      <Text fontWeight="bold">
                        {formatPrice(orderWorksheet.Order.TaxCost)}
                      </Text>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
              <Box bgColor="brand.500" width="100%" padding={4} color="white">
                <Flex justifyContent="space-between">
                  <Text>Order Total</Text>
                  <Text>{formatPrice(orderWorksheet.Order.Total)}</Text>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Flex>
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
                {formatPrice(orderWorksheet.Order.Total)}
              </Text>
              <Textarea
                marginTop={8}
                placeholder="Optional comments"
                value={returnComments}
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
              <Button
                marginLeft={5}
                bgColor="brand.500"
                color="white"
                onClick={requestRefund}
                disabled={loading}
              >
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
