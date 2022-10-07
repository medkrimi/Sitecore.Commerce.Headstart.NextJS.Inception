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
import Login from "../../components/account/Login"
import {useRouter} from "next/router"

const LogOff = () => {
  const {push} = useRouter()
  const handleOnLoggedIn = () => {
    push("/dashboard")
  }

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
      <NextSeo title="LogOff" />
      <Login onLoggedIn={handleOnLoggedIn} />
    </Flex>
  )
}

export default LogOff
