import {
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Text
} from "@chakra-ui/react"
import {Form} from "formik"
import Card from "lib/components/card/Card"
import {NextSeo} from "next-seo"

import React from "react"
import {HiOutlineMinusSm} from "react-icons/hi"

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

export default NewPromotionsPage

export async function getStaticProps() {
  return {
    props: {
      title: "New Promotion"
    }
  }
}
