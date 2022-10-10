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
      <NextSeo title="Buyer" />
      <Heading as="h1">OrderCloud Buyer Group and User Search!</Heading>
    </Flex>
  )
}

export default Orders
