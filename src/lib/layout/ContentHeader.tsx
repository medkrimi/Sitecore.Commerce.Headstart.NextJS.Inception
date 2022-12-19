import {Box, Flex, Heading, VStack} from "@chakra-ui/react"
import {useEffect, useState} from "react"

import Breadcrumbs from "nextjs-breadcrumbs"
import {textHelper} from "lib/utils"

const ContentHeader = (props) => {
  return (
    <VStack w="100%" width="full">
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
        mb="0"
      >
        <Breadcrumbs
          useDefaultStyle
          rootLabel="Home"
          transformLabel={(title) => textHelper.capitalizeFirstLetter(title)}
        />
      </Box>
      <Heading as="h2">{props.title}</Heading>
    </VStack>
  )
}

export default ContentHeader
