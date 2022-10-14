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

const Promotions = () => {
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
      <NextSeo title="Promotions" />
      <Heading as="h1">OrderCloud Promotions!</Heading>
    </Flex>
  )
}

export default Promotions
