import {
  Box,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
  Container
} from "@chakra-ui/react"
import {NextSeo} from "next-seo"

const Orders = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <NextSeo title="Orders" />
      <Heading as="h1">OrderCloud orders!</Heading>
    </Flex>
  )
}

export default Orders
