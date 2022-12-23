import {Box, Heading, VStack} from "@chakra-ui/react"

import Breadcrumbs from "nextjs-breadcrumbs"
import BuyerContextSwitch from "lib/components/buyers/BuyerContextSwitch"
import {textHelper} from "lib/utils"

const ContentHeader = (props) => {
  return (
    <VStack w="100%" width="full" marginBottom={3} marginTop={5}>
      {props?.header?.metas?.hasBreadcrumbs && (
        <Box
          //direction="row"
          alignItems="center"
          justifyContent="flex-start"
          gap={4}
          p={18}
          w="100%"
          width="full"
          maxW="full"
          display="inline-block"
        >
          <Breadcrumbs labelsToUppercase containerClassName="breadcrumb" />
        </Box>
      )}

      {props?.header?.title && (
        <Heading as="h1">{props?.header?.title}</Heading>
      )}
      {props?.header?.metas?.hasBuyerContextSwitch && (
        <Box
          //direction="row"
          alignItems="center"
          justifyContent="flex-start"
          gap={4}
          p={18}
          w="100%"
          width="full"
          maxW="full"
          display="inline-block"
          mt="20px"
        >
          <BuyerContextSwitch />
        </Box>
      )}
    </VStack>
  )
}

export default ContentHeader
