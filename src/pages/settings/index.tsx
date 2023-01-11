import {
  Box,
  Container,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue
} from "@chakra-ui/react"
import {HiOutlineFilter, HiOutlineShare} from "react-icons/hi"

import Card from "lib/components/card/Card"
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
      <SimpleGrid columns={7} spacing={3}>
        <Box width="225">
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
              <Icon
                as={HiOutlineFilter}
                fontSize="80px"
                title="Settings"
                color="darkGray"
              ></Icon>
              <Text width="100%" w="full">
                Product Facets
              </Text>
            </Link>
          </Card>
        </Box>
        <Box width="225">
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
            <Link href="/oc-admin/ocorg-graph">
              <Icon
                as={HiOutlineShare}
                fontSize="80px"
                title="Settings"
                color="darkGray"
              ></Icon>
              <Text width="100%" w="full">
                Organization
              </Text>
            </Link>
          </Card>
        </Box>
      </SimpleGrid>
    </Container>
  )
}

const ProtectedSettingsPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.MeManager}>
      <SettingsPage />
    </ProtectedContent>
  )
}

export default ProtectedSettingsPage
