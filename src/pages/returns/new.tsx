import {Button, Container, FormControl, FormLabel, HStack, Input} from "@chakra-ui/react"

import Card from "lib/components/card/Card"
import {NextSeo} from "next-seo"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "lib/constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "New Return",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const NewReturnPage = () => {
  return (
    <Container maxW="full">
      <NextSeo title="New Return" />
      <Card variant="primaryCard">
        <HStack justifyContent="space-between" w="100%">
          <FormControl>
            <FormLabel>Buyer</FormLabel>
            <Input type="text" />
            <FormLabel>Product(s)</FormLabel>
            <Input type="text" />
          </FormControl>
        </HStack>
        <HStack justifyContent="space-between" w="100%">
          <Button variant="secondaryButton">Cancel</Button>
          <Button> Submit</Button>
        </HStack>
      </Card>
    </Container>
  )
}

const ProtectedNewReturnPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <NewReturnPage />
    </ProtectedContent>
  )
}

export default ProtectedNewReturnPage
