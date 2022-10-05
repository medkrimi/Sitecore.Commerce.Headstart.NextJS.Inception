import {Flex} from "@chakra-ui/react"
import PromotionSearch from "lib/components/promotions/PromotionSearch"
import {useRouter} from "next/router"
import React, {useEffect, useState} from "react"

const Promotions = () => {
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const searchQuery = router.query.query as string
    setQuery(searchQuery)
  }, [router.query.query])

  return (
    <>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={4}
        mb={2}
        p={8}
        w="full"
      >
        <PromotionSearch query={query} />
      </Flex>
    </>
  )
}

export default Promotions
