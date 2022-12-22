import {
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Text
} from "@chakra-ui/react"

import Card from "lib/components/card/Card"
import {Form} from "formik"
import {HiOutlineMinusSm} from "react-icons/hi"
import {NextSeo} from "next-seo"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "lib/constants/app-permissions.config"

const NewPromotionsPage = () => {
  return (
    <Container maxW="full">
      <NextSeo title="New Promotion" />
      <Card variant="primaryCard">
        <IconButton
          variant="closePanelButton"
          aria-label="close panel"
          icon={<HiOutlineMinusSm />}
        ></IconButton>
        <Flex flexDirection="column" p="10">
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
        </Flex>
      </Card>
    </Container>
  )
}

const ProtectedNewPromotionsPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <NewPromotionsPage />
    </ProtectedContent>
  )
}

export default ProtectedNewPromotionsPage

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "New Promotion",
        metas: {
          hasBreadcrumbs: true
        }
      }
    }
  }
}
