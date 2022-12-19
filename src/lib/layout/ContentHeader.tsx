import {Heading, Flex, Box, VStack} from "@chakra-ui/react"
import BreadcrumbNavigation from "lib/components/navigation/BreadcrumbNavigation"
import {useEffect, useState} from "react"

interface BreadcrumbItem {
  name: string
  url: string
}
interface Breadcrumb {
  items: BreadcrumbItem[]
}
const ContentHeader = (props) => {
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb>()

  useEffect(() => {
    const doSetBreadcrumb = () => {
      const breadcrumbItems: BreadcrumbItem[] = [
        {
          name: "Home",
          url: "/dashboard"
        },
        {
          name: "Promotions",
          url: "/promotions"
        }
      ]
      const tmpbreadcrumb: Breadcrumb = {
        items: breadcrumbItems
      }
      setBreadcrumb(tmpbreadcrumb)
    }

    doSetBreadcrumb()
  }, [])

  return (
    <VStack w="100%" width="full">
      {breadcrumb?.items?.length ?? 0 > 0 ? (
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
          <BreadcrumbNavigation breadcrumbs={breadcrumb?.items ?? null} />
        </Box>
      ) : (
        <></>
      )}
      <Heading
        as="h2"
        textAlign="left"
        width="full"
        display="inline-block"
        pl="3"
        pb="5"
      >
        {props.title}
      </Heading>
    </VStack>
  )
}

export default ContentHeader
