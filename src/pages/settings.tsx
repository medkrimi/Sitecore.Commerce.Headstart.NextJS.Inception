import {Container, Heading, HStack, Text} from "@chakra-ui/react"
import {NextSeo} from "next-seo"

import React from "react"

const SettingsPage = () => {
  return (
    <Container maxW="full">
      <NextSeo title="Settings" />
      <Heading as="h2" marginTop={5}>
        Settings
      </Heading>
      <HStack justifyContent="space-between" w="100%">
        <Text>Coming Soon</Text>
      </HStack>
    </Container>
  )
}

export default SettingsPage