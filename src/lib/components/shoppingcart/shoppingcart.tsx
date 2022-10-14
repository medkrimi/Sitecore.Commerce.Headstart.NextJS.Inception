import NextLink from "next/link"
import {FunctionComponent} from "react"
import {deleteCurrentOrder} from "../../redux/ocCurrentOrder"
import {useOcDispatch} from "../../redux/ocStore"
import {
  VStack,
  Heading,
  Text,
  Button,
  Icon,
  HStack,
  Link
} from "@chakra-ui/react"
import useOcCurrentOrder from "../../hooks/useOcCurrentOrder"
import {HiChevronDoubleRight} from "react-icons/hi"
import OcCurrentOrderLineItemList from "./OcCurrentOrderLineItemList"

const ShoppingCart: FunctionComponent = () => {
  const dispatch = useOcDispatch()
  const {lineItems} = useOcCurrentOrder()

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

      {lineItems && lineItems.length ? (
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
              onClick={() => dispatch(deleteCurrentOrder())}
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
