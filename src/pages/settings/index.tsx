import {Container, HStack, Icon, Link, Text, useColorModeValue} from "@chakra-ui/react"

import Card from "lib/components/card/Card"
import {HiOutlineFilter} from "react-icons/hi"
import {NextSeo} from "next-seo"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "lib/constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Settings ",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}
const SettingsPage = () => {
  const color = useColorModeValue("boxTextColor.900", "boxTextColor.100")
  const boxBgColor = useColorModeValue("boxBgColor.100", "boxBgColor.600")

  return (
    <Container maxW="full">
      <NextSeo title="Settings" />
      <HStack justifyContent="space-between" w="100%">
        <Card
          showclosebutton="false"
          p="28px 10px 0px 0px"
          mb={{sm: "26px", lg: "0px"}}
          bg={boxBgColor}
          color={color}
          width="225px"
          maxW="225px"
          align="center"
        >
          <Link href="/settings/productfacets/">
            <Icon as={HiOutlineFilter} fontSize="80px" title="Settings" color="darkGray"></Icon>
            <Text width="100%" w="full">
              Product Facets
            </Text>
          </Link>
        </Card>
      </HStack>
    </Container>
  )
}

const ProtectedSettingsPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <SettingsPage />
    </ProtectedContent>
  )
}

export default ProtectedSettingsPage
