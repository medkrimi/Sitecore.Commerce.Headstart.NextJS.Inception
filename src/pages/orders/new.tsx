import {Container, Heading, HStack, Text} from "@chakra-ui/react"
import {NextSeo} from "next-seo"

import React from "react"

const NewOrdersPage = () => {
  return (
    <Container maxW="full">
      <NextSeo title="New Order" />
      <Heading as="h2" marginTop={5}>
        New Order
      </Heading>
      <HStack justifyContent="space-between" w="100%">
        <Text>Coming Soon</Text>
      </HStack>
    </Container>
  )
}

export default NewOrdersPage
