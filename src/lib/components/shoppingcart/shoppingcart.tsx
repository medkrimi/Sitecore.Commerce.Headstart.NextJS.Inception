import {
  Button,
  HStack,
  Heading,
  Icon,
  Link,
  Text,
  VStack
} from "@chakra-ui/react"
import {ComposedOrder, GetCurrentOrder} from "../../services/ordercloud.service"
import {FunctionComponent, useEffect, useState} from "react"

import {HiChevronDoubleRight} from "react-icons/hi"
import NextLink from "next/link"
import OcCurrentOrderLineItemList from "./OcCurrentOrderLineItemList"
import {Orders} from "ordercloud-javascript-sdk"

const ShoppingCart: FunctionComponent = () => {
  const [currentOrder, setCurrentOrder] = useState<ComposedOrder>()

  useEffect(() => {
    async function GetCart() {
      const cart = await GetCurrentOrder()
      setCurrentOrder(cart)
    }

    GetCart()
  }, [])

  const DeleteCurrentOrder = () => {
    Orders.Delete("Outgoing", currentOrder?.Order?.Order?.ID)
  }

  return (
    <VStack
      as="section"
      w="100%"
      width="full"
      pt="40px"
      pb="40px"
      mt="30px"
      maxWidth="1000px"
    >
      <Heading as="h1">Shopping Cart</Heading>

      {currentOrder?.Order?.LineItems &&
      currentOrder?.Order?.LineItems?.length ? (
        <VStack w="100%" width="full" justifyContent="flex-end">
          <HStack w="100%" width="full" justifyContent="space-between">
            <Button
              type="button"
              border="1px"
              borderColor="gray.300"
              bgColor="white"
              rounded="0"
              p="4"
              fontSize="12"
            >
              Continue Shopping
            </Button>
            <Button
              type="button"
              onClick={DeleteCurrentOrder}
              border="1px"
              bgColor="white"
              borderColor="red.500"
              color="red.500"
              p="4"
              rounded="sm"
              fontSize="12"
            >
              Clear Cart
            </Button>
          </HStack>

          <HStack
            w="100%"
            width="full"
            justifyContent="space-between"
            alignItems="flex-start"
            pt="10"
          >
            <OcCurrentOrderLineItemList
              emptyMessage="Your shopping cart is empty"
              editable
            />
            <NextLink href="/checkout" passHref>
              <Link
                width={48}
                bg="brand.500"
                color="white"
                textAlign="center"
                p={4}
              >
                <HStack w="100%" width="full" justifyContent="center">
                  <Text>Checkout</Text>
                  <Icon as={HiChevronDoubleRight} />
                </HStack>
              </Link>
            </NextLink>
          </HStack>
        </VStack>
      ) : (
        <VStack>
          <Text>Your shopping cart is empty</Text>
        </VStack>
      )}
    </VStack>
  )
}

export default ShoppingCart
