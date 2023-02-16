import {Box, Container, Grid, GridItem, Icon, Link, Text, useColorModeValue} from "@chakra-ui/react"
import {HiOutlineFilter, HiOutlineShare, HiUsers} from "react-icons/hi"

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
        title: "Settings",
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
      <Grid gridTemplateColumns="repeat(auto-fit, 225px)" gridGap="1rem">
        <GridItem>
          <Link href="/settings/graph/">
            <Card showclosebutton="false" color={color} align="center">
              <Box>
                <Icon as={HiOutlineShare} fontSize="80px" title="Settings" color="darkGray"></Icon>
                <Text width="100%" w="full">
                  Marketplace Graph
                </Text>
              </Box>
            </Card>
          </Link>
        </GridItem>
        <GridItem>
          <Link href="/settings/adminusers/">
            <Card showclosebutton="false" color={color} align="center">
              <Box>
                <Icon as={HiUsers} fontSize="80px" title="Settings" color="darkGray"></Icon>
                <Text width="100%" w="full">
                  Admin Users
                </Text>
              </Box>
            </Card>
          </Link>
        </GridItem>
        <GridItem>
          <Link href="/settings/productfacets/">
            <Card showclosebutton="false" bg={boxBgColor} color={color} align="center">
              <Box>
                <Icon as={HiOutlineFilter} fontSize="80px" title="Settings" color="darkGray"></Icon>
                <Text width="100%" w="full">
                  Product Facets
                </Text>
              </Box>
            </Card>
          </Link>
        </GridItem>
      </Grid>
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
