import {Flex, Heading} from "@chakra-ui/react"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {NextSeo} from "next-seo"

const Users = () => {
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

const ProtectedUsers = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Users />
    </ProtectedContent>
  )
}

export default ProtectedUsers
